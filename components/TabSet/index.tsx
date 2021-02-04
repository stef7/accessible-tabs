import cloneDeep from "lodash/cloneDeep";
import defaults from "lodash/defaults";
import merge from "lodash/merge";
import { useRouter } from "next/router";
import React, { Dispatch, MutableRefObject, useEffect, useReducer, useRef, useState } from "react";

import styles from "./index.module.scss";

type TabSetProps = {
	uniqueName: string;
	tabs: {
		uniqueName: string;
		content: React.ReactNode;
		isActive?: boolean;
	}[];
	options?: {
		useQuery?: boolean;
		useHash?: boolean;
		hardErrors?: boolean;
	};
};

const reportError = (msg: string) => {
	if (typeof window !== "undefined") console.error(msg);
	else console.error(new Error(msg));
};

const createSlug = (name: string): string =>
	name
		.replace(/[^a-zA-Z1-3]+/gi, " ")
		.trim()
		.replace(/ /g, "-")
		.toLowerCase();

const getUniqueSlug = (
	uniqueName: string,
	slugSetName: string,
	slugSet: Record<string, number>,
	hardErrors: TabSetProps["options"]["hardErrors"] = true,
): string => {
	const slug = createSlug(uniqueName);

	if (!slugSet) return slug;

	let increment = slugSet[slug];
	increment = slugSet[slug] = increment === undefined ? 0 : increment + 1;

	const slugUnique = increment ? `${slug}-${increment + 1}` : slug;

	// report duplicate tab slug issue [on client-side]
	if (slugUnique !== slug) {
		const errorText = `${slugSetName} slug "${slug}" (based on uniqueName) is not unique. Adding incremental suffix makes it "${slugUnique}", but as this is sequence-based, this will cause usability/accessibility issues if left unresolved.`;
		reportError(errorText);
		if (hardErrors) throw new Error(errorText);
		// hopefully catches duplicate id issues on dev/server-side too ^
	}
	return slugUnique;
};

const querySlugString = (querySlug: string | string[]) => {
	if (Array.isArray(querySlug)) querySlug = querySlug.join("");
	return querySlug;
};

let scrollPosition: { top: number; left: number };
const saveScroll = () => {
	if (typeof window !== "object") return;
	scrollPosition = { top: window.scrollY, left: window.scrollX };
};
const restoreScroll = () => {
	if (typeof window !== "object") return;
	window.scrollTo(scrollPosition);
};

const windowState: Record<string, unknown> =
	typeof window === "object" && window.history?.state === "object" ? window.history.state : {};
const keepState = () => merge(windowState, window.history.state);

/**
 * TabSet: accessible tabs component. Spits out a set of
 * @param props.uniqueName A name for this particular instance of the tab set. This should be unique, as it is turned into a "slug" which will become the unique identifier used in URLs.
 * @param props.tabs[] An array of tab objects, each with the following properties:
 * @param props.tabs[].uniqueName: A name for this particular tab. Must also be unique - similar rules and usage as tab sets.
 * @param props.tabs[].content: A React.ReactNode or JSX.Element object.
 * @param props.options A configuration object determining the behaviour of the component:
 * @param props.options.useHash sets the location hash to the tab most recently selected (across all tab sets). Defaults to `false`
 * @param props.options.useQuery: sets a location search query param (for this tab set specifically) when a tab is selected. Defaults to `false`
 * @param props.options.hardErrors: throws a show-stopping error when a duplicate slug is used. Defaults to `true`
 *
 * @example
 * <TabSet
 * 	uniqueName="My tabs"
 * 	tabs={[
 * 		{
 * 			uniqueName: "One",
 * 			content: <p>Goodbye</p>,
 * 			isActive: false,
 * 		},
 * 		{
 * 			uniqueName: "Two",
 * 			content: <p>Hello</p>,
 * 			isActive: true,
 * 		}
 * 	]}
 * />
 */
const TabSet: React.FC<TabSetProps> = function ({ uniqueName, tabs: tabsInit, options }) {
	defaults(options, {
		useQuery: true,
		useHash: false,
		hardErrors: !/prod/.test(process.env.NODE_ENV),
	});

	const tabSetSlug = getUniqueSlug(uniqueName, "TabSet", undefined, options.hardErrors);
	const tabSetId = `tabs--${tabSetSlug}`;
	const tabSetDiv = useRef<HTMLDivElement>(null);

	const router = useRouter();

	const tabSlugs = {};
	const tabs = tabsInit.map((tab) => {
		const tabSlug = getUniqueSlug(
			tab.uniqueName,
			`TabSet "${tabSetSlug}" tab`,
			tabSlugs,
			options.hardErrors,
		);
		return {
			initData: tab,
			slug: tabSlug,
			tabId: `tab--${tabSetSlug}--${tabSlug}`,
			panelId: `${tabSetSlug}--${tabSlug}`,
		};
	});

	const [activeIdx, setActiveIdx] = useState(() => {
		const querySlug = querySlugString(router.query[tabSetSlug]);
		if (querySlug) return tabs.findIndex((tab) => tab.slug === querySlug);

		const firstActive = tabs.find((tab) => tab.initData.isActive);
		if (firstActive) return tabs.indexOf(firstActive);

		return 0;
	});

	const [focused, setFocused] = useState({ panelIndex: undefined, tabIndex: undefined });
	useEffect(() => {
		let element: HTMLDivElement | HTMLButtonElement;
		if (focused.panelIndex !== undefined) {
			element = tabSetDiv.current?.getElementsByClassName(styles.panel)[
				focused.panelIndex
			] as HTMLDivElement;
		} else if (focused.tabIndex !== undefined) {
			element = tabSetDiv.current?.getElementsByClassName(styles.tab)[
				focused.tabIndex
			] as HTMLButtonElement;
		}
		element?.focus();
	}, [focused]);

	const selectTab = async (newIdx: number, focusTab?: boolean) => {
		console.log("selectTab", newIdx);
		saveScroll();

		const activeSlug = tabs[newIdx].slug;

		let url: URL;
		if (options.useHash || options.useQuery) {
			url = new URL(window.location.href);

			if (options.useQuery) url.searchParams.set(tabSetSlug, activeSlug);
			if (options.useHash) url.hash = `${tabSetSlug}--${activeSlug}`;

			await router.push(url, undefined, { shallow: true, scroll: false });
		} else {
			setActiveIdx(newIdx);
		}
		if (options.useHash) {
			setActiveIdx(newIdx); // why is this needed even with router.push?
			restoreScroll(); // doesn't work?
		}

		const historyMethod = options.useHash || options.useQuery ? "replaceState" : "pushState";
		const newState = {
			...window.history.state,
			tabsets: merge(window.history.state.tabsets || {}, {
				[tabSetSlug]: activeSlug,
			}),
		};
		window.history[historyMethod](newState, document.title, window.location.href);

		if (focusTab) setFocused({ panelIndex: undefined, tabIndex: newIdx });
		else setFocused({ panelIndex: newIdx, tabIndex: undefined });
	};

	const setActiveSlugFromQuery = () => {
		if (options.useQuery) {
			const querySlug = querySlugString(router.query[tabSetSlug]);
			if (!querySlug) return;
			const index = tabs.findIndex((tab) => tab.slug === querySlug);
			if (index !== undefined) setActiveIdx(index);
		}
	};
	useEffect(setActiveSlugFromQuery, [router.query[tabSetSlug]]);

	const setActiveSlugFromState = () => {
		const stateSlug = windowState.tabsets?.[tabSetSlug];
		if (!stateSlug) return;
		const index = tabs.findIndex((tab) => tab.slug === stateSlug);
		if (index !== undefined) setActiveIdx(index);
	};
	const onPopState = (event: PopStateEvent) => {
		keepState();
		setActiveSlugFromState();
		restoreScroll();
	};
	const onPopStateInspect = (event: PopStateEvent) => {
		console.warn(cloneDeep(window.history.state), event);
	};
	if (typeof window !== "undefined") keepState();
	useEffect(() => {
		if (!options.useQuery && !options.useHash) {
			keepState();
			window.addEventListener("popstate", onPopState);
			window.addEventListener("popstate", onPopStateInspect);
			return () => {
				window.removeEventListener("popstate", onPopState);
				window.removeEventListener("popstate", onPopStateInspect);
			};
		}
	}, []);

	return (
		<div id={tabSetId} ref={tabSetDiv} className={styles.tabset}>
			<ul role="tablist" aria-label={`Tabs: ${uniqueName}`} className={styles.tabs}>
				{tabs.map((tab, i) => (
					<li className={i === activeIdx ? styles.itemActive : null} key={i}>
						<button
							role="tab"
							tabIndex={i === activeIdx ? 0 : -1}
							className={styles.tab}
							aria-selected={i === activeIdx}
							aria-controls={tab.panelId}
							id={tab.tabId}
							onKeyDown={(event) => {
								if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;

								const newIdx =
									event.key === "ArrowLeft"
										? i === 0
											? tabs.length - 1
											: i - 1
										: i === tabs.length - 1
										? 0
										: i + 1;

								selectTab(newIdx, true);
							}}
							onClick={() => selectTab(i)}>
							{tab.initData.uniqueName}
						</button>
					</li>
				))}
			</ul>

			{tabs.map((tab, i) => (
				<div
					role="tabpanel"
					tabIndex={0}
					className={styles.panel}
					id={tab.panelId}
					aria-labelledby={tab.tabId}
					hidden={i !== activeIdx}
					aria-hidden={i !== activeIdx}
					key={i}>
					{tab.initData.content}
				</div>
			))}
		</div>
	);
};

export default TabSet;
