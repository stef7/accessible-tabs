import React from "react";
import Head from "next/head";
import { LoremIpsum } from "lorem-ipsum";

import TabSet from "../components/TabSet";
import Container from "../components/Container";

export default function Page() {
	const lorem = new LoremIpsum({
		sentencesPerParagraph: {
			max: 5,
			min: 2,
		},
		wordsPerSentence: {
			max: 12,
			min: 8,
		},
	});
	const paragraphs = () =>
		Array(3)
			.fill(0)
			.map((_, i) => <p key={i}>{lorem.generateParagraphs(1)}</p>);
	return (
		<>
			<Head>
				<title>Accessible Tabs</title>
			</Head>
			<Container>
				<TabSet
					{...{
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
					}}
				/>

				<TabSet
					{...{
						uniqueName: "another tabset",
						tabs: Array(3)
							.fill(0)
							.map((_, i) => ({
								uniqueName: i < 2 ? "same tab name oops" : lorem.generateWords(2),
								content: <p>{lorem.generateSentences(3)}</p>,
							})),
					}}
				/>
				<TabSet
					{...{
						uniqueName: "another tabset",
						tabs: Array(4)
							.fill(0)
							.map(() => ({
								uniqueName: lorem.generateWords(3),
								content: <p>{lorem.generateSentences(2)}</p>,
							})),
					}}
				/>
			</Container>
		</>
	);
}
