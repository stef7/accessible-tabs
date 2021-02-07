import Enzyme, { shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import React from "react";

Enzyme.configure({ adapter: new Adapter() });

import TabSet, { TabSetProps } from "./index";

const mockProps1: TabSetProps = {
	uniqueName: " Lorem !@#$ ipsum !! ",
	tabs: [
		{
			uniqueName: "One",
			content: <p>Dolor sit amet</p>,
		},
		{
			uniqueName: "Two",
			content: <p>Nobis a repellendus</p>,
			isActive: true,
		},
		{
			uniqueName: "Three",
			content: <p>Culpa hendrerit fugiat</p>,
		},
	],
};

const mockProps2: TabSetProps = {
	uniqueName: "Lorem ipsum",
	tabs: [
		{
			uniqueName: "Dupicate tab name",
			content: <p>Dolor sit amet</p>,
		},
		{
			uniqueName: "Dupicate tab name",
			content: <p>Nobis a repellendus</p>,
		},
		{
			uniqueName: "Three",
			content: <p>Culpa hendrerit fugiat</p>,
		},
		{
			uniqueName: "Four",
			content: <p>Culpa hendrerit fugiat</p>,
		},
	],
};

const TabSetWrapper = (props) => {
	return <TabSet {...props} />;
};

describe("<TabSet />", () => {
	it("renders the component and its attributes", () => {
		const wrapper = shallow(<TabSetWrapper {...mockProps1} />);

		expect(wrapper.find(TabSet)).toHaveLength(1);
		expect(wrapper.props()).toEqual(mockProps1);
	});

	it("renders the correct number of tabs and panels", () => {
		const wrapper = shallow(<TabSet {...mockProps1} />);

		const listItems = wrapper.find(`ul[role="tablist"] > li`);
		expect(listItems).toHaveLength(3);

		const tabs = listItems.find(`[role="tab"]`);
		expect(tabs).toHaveLength(3);

		const panels = wrapper.find(`div[role="tabpanel"]`);
		expect(panels).toHaveLength(3);
	});

	it("generates slugs and sets IDs and accessibility attributes correctly", () => {
		const wrapper = shallow(<TabSet {...mockProps1} />);

		expect(wrapper.render()).toHaveAttribute("id", "lorem-ipsum");

		const tabs = wrapper.find(`ul[role="tablist"] > li > [role="tab"]`);
		const panels = wrapper.find(`div[role="tabpanel"]`);

		const tabCtrls = tabs.map((tab) => tab.prop("aria-controls"));
		const panelCtrlBys = panels.map((panel) => panel.prop("aria-controlled-by"));

		const expectedPanelIds = ["lorem-ipsum--one", "lorem-ipsum--two", "lorem-ipsum--three"];
		const panelIds = panels.map((panel) => panel.prop("id"));
		expect(panelIds).toEqual(expectedPanelIds);
		expect(tabCtrls).toEqual(expectedPanelIds);

		const expectedTabIds = [
			"tab--lorem-ipsum--one",
			"tab--lorem-ipsum--two",
			"tab--lorem-ipsum--three",
		];
		const tabIds = tabs.map((tab) => tab.prop("id"));
		expect(tabIds).toEqual(expectedTabIds);
		expect(panelCtrlBys).toEqual(expectedTabIds);
	});

	it("loads the correct tab on load", () => {
		const wrapper = shallow(<TabSet {...mockProps1} />);

		expect(wrapper.render()).toHaveAttribute("id", "lorem-ipsum");

		const tabs = wrapper.find(`ul[role="tablist"] > li > [role="tab"]`);
		const panels = wrapper.find(`div[role="tabpanel"]`);

		const tabCtrls = tabs.map((tab) => tab.prop("aria-controls"));
		const panelCtrlBys = panels.map((panel) => panel.prop("aria-controlled-by"));

		const expectedPanelIds = ["lorem-ipsum--one", "lorem-ipsum--two", "lorem-ipsum--three"];
		const panelIds = panels.map((panel) => panel.prop("id"));
		expect(panelIds).toEqual(expectedPanelIds);
		expect(tabCtrls).toEqual(expectedPanelIds);

		const expectedTabIds = [
			"tab--lorem-ipsum--one",
			"tab--lorem-ipsum--two",
			"tab--lorem-ipsum--three",
		];
		const tabIds = tabs.map((tab) => tab.prop("id"));
		expect(tabIds).toEqual(expectedTabIds);
		expect(panelCtrlBys).toEqual(expectedTabIds);
	});
	it("loads the correct tab from tab isActive=true on load", () => {
		const wrapper = shallow(<TabSet {...mockProps1} />);

		expect(wrapper.render()).toHaveAttribute("id", "lorem-ipsum");

		const tabs = wrapper.find(`ul[role="tablist"] > li > [role="tab"]`);
		const panels = wrapper.find(`div[role="tabpanel"]`);

		const tabCtrls = tabs.map((tab) => tab.prop("aria-controls"));
		const panelCtrlBys = panels.map((panel) => panel.prop("aria-controlled-by"));

		const expectedPanelIds = ["lorem-ipsum--one", "lorem-ipsum--two", "lorem-ipsum--three"];
		const panelIds = panels.map((panel) => panel.prop("id"));
		expect(panelIds).toEqual(expectedPanelIds);
		expect(tabCtrls).toEqual(expectedPanelIds);

		const expectedTabIds = [
			"tab--lorem-ipsum--one",
			"tab--lorem-ipsum--two",
			"tab--lorem-ipsum--three",
		];
		const tabIds = tabs.map((tab) => tab.prop("id"));
		expect(tabIds).toEqual(expectedTabIds);
		expect(panelCtrlBys).toEqual(expectedTabIds);
	});
});
