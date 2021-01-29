import React from "react";
import Head from "next/head";

import TabSet from "../components/TabSet";
import Container from "../components/Container";

const paragraphs = (
	<>
		<p>Tempor vivamus repellat delectus, senectus, at! At praesent varius nemo.</p>
		<p>Proin minus nunc! Duis natus suscipit ultricies velit beatae, quas.</p>
		<p>Mollis id explicabo temporibus cupidatat iaculis qui adipiscing blanditiis omnis.</p>
	</>
);

export default function Page() {
	return (
		<>
			<Head>
				<title>Accessible Tabs</title>
			</Head>
			<Container>
				<TabSet
					{...{
						uniqueName: "my first tabset",
						tabs: [
							{
								uniqueName: "tab one",
								content: paragraphs,
							},
							{
								uniqueName: "tab two",
								content: paragraphs,
							},
							{
								uniqueName: "tab one",
								content: paragraphs,
							},
						],
					}}
				/>

				<TabSet
					{...{
						uniqueName: "my second tabset",
						tabs: [
							{
								uniqueName: "tab one",
								content: paragraphs,
							},
							{
								uniqueName: "tab two",
								content: paragraphs,
							},
							{
								uniqueName: "tab one",
								content: paragraphs,
							},
						],
					}}
				/>
			</Container>
		</>
	);
}
