import React from "react";
import Head from "next/head";
import { LoremIpsum } from "lorem-ipsum";

import TabSet from "../components/TabSet";
import Container from "../components/Container";
import { GetStaticProps } from "next";
import { AppContext } from "./_app";

export default function Page({ tabsets }) {
	return (
		<>
			<Head>
				<title>Accessible Tabs</title>
			</Head>
			<Container>
				{tabsets.map((tabset, i) => (
					<TabSet
						{...{
							key: i,
							uniqueName: tabset.uniqueName,
							tabs: tabset.tabs,
							contextWithTabSets: AppContext,
						}}
					/>
				))}
			</Container>
		</>
	);
}

export const getStaticProps: GetStaticProps = async () => {
	const lorem = new LoremIpsum();
	const paragraphs = () =>
		Array(3)
			.fill(0)
			.map((_, i) => lorem.generateParagraphs(i));

	return {
		props: {
			tabsets: [
				{
					uniqueName: "my tabset",
					tabs: [
						{
							uniqueName: lorem.generateWords(3),
							content: paragraphs(),
						},
						{
							uniqueName: lorem.generateWords(2),
							content: paragraphs(),
						},
						{
							uniqueName: lorem.generateWords(3),
							content: paragraphs(),
						},
					],
				},
				{
					uniqueName: "another tabset",
					tabs: Array(3)
						.fill(0)
						.map((_, i) => ({
							uniqueName: i < 2 ? "same tab name oops " : " another tab ... ",
							content: lorem.generateSentences(3),
						})),
				},
				{
					uniqueName: "another tabset",
					tabs: Array(4)
						.fill(0)
						.map((_, i) => ({
							uniqueName: `(tabset has name oops!) tab ${i}`,
							content: lorem.generateSentences(2),
						})),
				},
			],
		},
	};
};
