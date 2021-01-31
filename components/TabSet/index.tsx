import { NextRouter, useRouter } from "next/router";
import React, {
	Context,
	createContext,
	Dispatch,
	Reducer,
	ReducerAction,
	ReducerState,
	useContext,
	useEffect,
	useReducer,
	useRef,
	useState,
} from "react";

import styles from "./index.module.scss";

type TabSetLookup = {
	[index: string]: number;
};
type TabSetsState = TabSetLookup;

type TabSetsReducer = <R extends Reducer<any, any>>(
	reducer: R,
	initialState: ReducerState<R>,
) => [ReducerState<R>, Dispatch<ReducerAction<R>>];

export const getTabSetsContextValue: () => ReturnType<TabSetsReducer> = () =>
	useReducer(
		(state: TabSetsState, tabSetKey: string) => ({
			...state,
			[tabSetKey]: state[tabSetKey] === undefined ? 0 : state[tabSetKey] + 1,
		}),
		{} as TabSetsState,
	);

type ContextWithTabSets = Context<{
	[index: string]: any;
	tabSets: ReturnType<typeof getTabSetsContextValue>;
}>;

interface TabSetProps {
	contextWithTabSets: ContextWithTabSets;
	uniqueName: string;
	tabs: {
		uniqueName: string;
		content: React.ReactNode;
		isActive?: boolean;
	}[];
}

const createSlug = (name) =>
	name
		.replace(/[^a-zA-Z1-3]+/gi, " ")
		.trim()
		.replace(/ /g, "-")
		.toLowerCase();

const incrementTabSetKey = (
	key: string,
	lookupObj?: TabSetLookup,
	contextWithTabSets?: TabSetProps["contextWithTabSets"],
) => {
	if (lookupObj) {
		const val = lookupObj[key];
		lookupObj[key] = val === undefined ? 0 : val + 1;
		return lookupObj[key];
	} else if (contextWithTabSets) {
		const {
			tabSets: [state, dispatch],
		} = useContext(contextWithTabSets);
		dispatch(key);
		return state[key];
	} else {
		throw new Error("no key lookup provided");
	}
};

const getUniqueSlug = (
	uniqueName: string,
	slugSetName: string,
	slugsObj?: Record<string, number>,
	context?: TabSetProps["contextWithTabSets"],
): string => {
	const slug = createSlug(uniqueName);

	const times = incrementTabSetKey(slug, slugsObj, context);

	const slugUnique = times ? `${slug}-${times + 1}` : slug;

	if (slugUnique !== slug) {
		console.error(
			`${slugSetName} slug "${slug}" (sanitised uniqueName) is not unique. Adding incremental suffix, it's now "${slugUnique}", but please note this is not reliable. Please be more original ;)`,
		);
	}

	return slugUnique;
};

let scrollPos: { left: number; top: number };
const saveScroll = () => {
	scrollPos = { left: window.scrollX, top: window.scrollY };
};
const restoreScroll = () => {
	if (scrollPos) {
		window.scrollTo(scrollPos);
	}
};

const selectTab = (router: NextRouter, tabSetSlug: string, tabSlug: string): void => {
	const url = new URL(window.location.href);
	url.searchParams.set(`${tabSetSlug}`, tabSlug);
	url.hash = `${tabSetSlug}--${tabSlug}`;

	router.push(url, undefined, { shallow: true });
};

const querySlugString = (querySlug: string | string[]) => {
	if (Array.isArray(querySlug)) querySlug = querySlug.join("");
	return querySlug;
};

export default function TabSet({
	contextWithTabSets,
	uniqueName,
	tabs: tabsStart,
}: TabSetProps): JSX.Element {
	if (!contextWithTabSets) throw new Error("no contextWithTabSets provided");

	const tabSetSlug = getUniqueSlug(uniqueName, "TabSet", undefined, contextWithTabSets);
	const tabSetId = `tabSet--${tabSetSlug}`;

	const tabsSlugs = {};
	const tabs = tabsStart.map((tab) => {
		const { uniqueName: tabName } = tab;

		const tabSlug = getUniqueSlug(tabName, `TabSet "${tabSetSlug}" tab`, tabsSlugs);

		return {
			...tab,
			slug: tabSlug,
			panelId: `${tabSetSlug}--${tabSlug}`,
			tabId: `tab--${tabSetSlug}--${tabSlug}`,
		};
	});

	const router = useRouter();

	const startTab = tabs.find((tab) => tab.isActive) || tabs[0];
	let querySlug = querySlugString(router.query[tabSetSlug]);
	const queryTab = querySlug && tabs.find((tab) => tab.slug === querySlug);

	const [activeSlug, setActiveSlug] = useState(queryTab?.slug || startTab?.slug);

	const panelRefs = tabs.map(() => useRef<HTMLDivElement>());

	useEffect(() => {
		router.events.on("hashChangeComplete", (url, { shallow }) => {
			if (shallow) restoreScroll();
		});

		/* not required? hash focuses automatically?
		const hash = window.location.hash;
		if (hash) {
			panelRefs[tabs.findIndex((tab) => tab.panelId == hash)]?.current?.focus();
		}
		*/
	}, []);

	useEffect(() => {
		querySlug = querySlugString(router.query[tabSetSlug]);
		if (querySlug) setActiveSlug(querySlug);
	}, [router.query[tabSetSlug]]);

	return (
		<div id={tabSetId} className={styles.tabSet}>
			<ul role="tablist" aria-label={uniqueName} className={styles.tabs}>
				{tabs.map((tab, i) => (
					<li key={i}>
						<button
							className={styles.tab}
							role="tab"
							aria-selected={tab.slug === activeSlug}
							aria-controls={tab.panelId}
							id={tab.tabId}
							tabIndex={tab.slug === activeSlug ? -1 : 0}
							onClick={() => {
								saveScroll();
								selectTab(router, tabSetSlug, tab.slug);
								panelRefs[i]?.current?.focus();
							}}>
							{tab.uniqueName}
						</button>
					</li>
				))}
			</ul>
			{tabs.map((tab, i) => (
				<div
					className={styles.panel}
					key={i}
					id={tab.panelId}
					role="tabpanel"
					tabIndex={0}
					aria-labelledby={tab.tabId}
					hidden={tab.slug !== activeSlug}>
					{tab.content}
				</div>
			))}
		</div>
	);
}
