import React, { useEffect, useState } from "react";

import styles from "./index.module.scss";

interface TabSetProps {
	uniqueName: string;
	tabs: {
		uniqueName: string;
		content: React.ReactNode;
	}[];
}

const createSlug = (str: string): string => str.trim().replace(/[^a-zA-Z1-3]+/gi, "-");

const tabSetSlugs = new Set();

const onTabSelect = (tabSetSlug, tabSlug) => {
	// useEffect(() => {
	// 	router.push("?tab=10", undefined, { shallow: true });
	// }, []);
};

export default function TabSet({ uniqueName, tabs }: TabSetProps) {
	const tabSetSlug = createSlug(uniqueName);

	if (tabSetSlugs.has(tabSetSlug)) {
		console.error(
			new Error(
				`Tabset slug "${tabSetSlug}" (sanitised uniqueName) is not unique. Adding incremental suffix, but please note this is not reliable. Please be more original ;)`,
			),
		);
	}

	const tabSlugs = new Set();

	const tabData = tabs.map((tab) => {
		const { uniqueName, content } = tab;
		const tabSlug = createSlug(uniqueName);

		if (tabSlugs.has(tabSlug)) {
			console.error(
				new Error(
					`Tab slug "${tabSlug}" (in tabset "${tabSetSlug}" (sanitised uniqueName) is not unique. Adding incremental suffix, but please note this is not reliable. Please be more original ;)`,
				),
			);
		}

		return {
			...tab,
			isActive: true,
			slug: tabSlug,
		};
	});

	const activeTab = tabData.find((t) => t.isActive);

	return (
		<div className={styles.tabset}>
			<ul>
				{tabData.map((tab, i) => (
					<li key={i}>
						<button>{tab.uniqueName}</button>
					</li>
				))}
			</ul>
			<div>{activeTab.content}</div>
		</div>
	);
}
