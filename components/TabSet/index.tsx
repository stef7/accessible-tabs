import { NextRouter, useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";

import { useAppContext } from "../../lib/context";
import styles from "./index.module.scss";

interface TabSetProps {
	uniqueName: string;
	tabs: {
		uniqueName: string;
		content: React.ReactNode;
		isActive?: boolean;
	}[];
}

const uniqueCache = {};
const uniqueFor = (key: string) => {
	let times = uniqueCache[key];
	if (times === undefined) times = uniqueCache[key] = 0;
	else times = uniqueCache[key] += 1;
	return times ? `${key}-${times}` : key;
};
const uniqueSlug = (uniqueName: string, slugSetName: string): string => {
	const slug1 = uniqueName
		.replace(/[^a-zA-Z1-3]+/gi, " ")
		.trim()
		.replace(/ /g, "-")
		.toLowerCase();

	const slug2 = uniqueFor(slug1);
	if (slug2 !== slug1) {
		console.error(
			`${slugSetName} slug "${slug1}" (sanitised uniqueName) is not unique. Adding incremental suffix, it's now "${slug2}", but please note this is not reliable. Please be more original ;)`,
		);
	}

	return slug2;
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
	url.searchParams.set(`tabs--${tabSetSlug}`, tabSlug);
	url.hash = `tab--${tabSetSlug}--${tabSlug}`;

	router.push(url, undefined, { shallow: true });
};

const querySlugString = (querySlug: string | string[]) => {
	if (Array.isArray(querySlug)) querySlug = querySlug.join("");
	return querySlug;
};

export default function TabSet({ uniqueName, tabs: tabsStart }: TabSetProps): JSX.Element {
	const tabSetSlug = uniqueSlug(uniqueName, "Tabset");
	const tabSetId = `tabset--${tabSetSlug}`;

	const tabs = tabsStart.map((tab) => {
		const { uniqueName: tabName } = tab;
		const tabSlug = uniqueSlug(tabName, `Tabset "${tabSetSlug}" tab`);
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

		const hash = window.location.hash;
		if (hash) {
			panelRefs[tabs.findIndex((tab) => tab.panelId == hash)]?.current?.focus();
		}
	}, []);

	useEffect(() => {
		querySlug = querySlugString(router.query[tabSetSlug]);
		if (querySlug) setActiveSlug(querySlug);
	}, [router.query[tabSetSlug]]);

	return (
		<div id={tabSetId} className={styles.tabset}>
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
