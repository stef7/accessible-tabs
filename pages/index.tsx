import React from "react";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import Head from "next/head";
import { LoremIpsum } from "lorem-ipsum";

import TabSet from "../components/TabSet";
import Container from "../components/Container";

type PageTabSetProps = {
	uniqueName: string;
	tabs: {
		uniqueName: string;
		content: string[];
		isActive?: boolean;
	}[];
};

export default function Page({ tabsets }: InferGetStaticPropsType<typeof getStaticProps>) {
	return (
		<>
			<Head>
				<title>Accessible Tabs</title>
			</Head>
			<Container>
				{tabsets.map((tabset, i) => (
					<TabSet
						key={i}
						uniqueName={tabset.uniqueName}
						tabs={tabset.tabs.map((tab) => ({
							...tab,
							content: tab.content.map((para, pi) => <p key={pi}>{para}</p>),
						}))}
						options={{
							useHash: false,
							useQuery: false,
							hardErrors: false,
						}}
					/>
				))}
			</Container>
		</>
	);
}

export const getStaticProps: GetStaticProps<{ tabsets: PageTabSetProps[] }> = async () => {
	const lorem = new LoremIpsum();
	const paragraphs = () =>
		Array(3)
			.fill(0)
			.map((_, i) => lorem.generateSentences(i));

	return {
		props: {
			tabsets: [
				{
					uniqueName: "first tabset",
					tabs: [
						{
							uniqueName: "aaa",
							content: paragraphs(),
						},
						{
							uniqueName: "b b b",
							content: paragraphs(),
						},
						{
							uniqueName: "c cc",
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
							content: paragraphs(),
						})),
				},
				...Array(1)
					.fill(0)
					.map(() => ({
						uniqueName: "duplicate tabset name",
						tabs: Array(2)
							.fill(0)
							.map((_, i) => ({
								uniqueName: `tab ${i + 1}`,
								content: paragraphs(),
							})),
					})),
			],
		},
	};
};
