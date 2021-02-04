# Accessible Tabs

This accessible tabs component runs within a Next.js/React application.

To begin, run either `npm install` or `yarn` to install all the package dependencies.

## Running component tests

TBC

## Using the TabSet component

The `TabSet` component was built with full Typescript support. It accepts the following properties:

|Prop|Purpose|
|-|-|
|`uniqueName`|(Required) A name for this particular instance of the tab set. This should be unique, as it is turned into a "slug" which will become the unique identifier used in URLs.
|`tabs`|(Required) An array of tab objects, each with the following properties:<ul><li>`uniqueName`: (Required) A name for this particular tab. Must also be unique - similar rules and usage as tab sets.<li>`content`: (Required) A React.ReactNode or JSX.Element object.</ul>
|`options`|A configuration object determining the behaviour of the component: <ul><li>`useHash`: sets the location hash to the tab most recently selected (across all tab sets). Defaults to `false`<li>`useQuery`: sets a location search query param (for this tab set specifically) when a tab is selected. Defaults to `false`<li>`hardErrors`: throws a show-stopping error when a duplicate slug is used. Defaults to `true`</ul>


## React component example
```tsx
<TabSet
	uniqueName="My tabs"
	tabs={[
		{
			uniqueName: "One",
			content: <p>Goodbye</p>,
			isActive: false,
		},
		{
			uniqueName: "Two",
			content: <p>Hello</p>,
			isActive: true,
		}
	]}
/>
```

## Notes on real-world accessibility

According to this article from https://simplyaccessible.com/article/danger-aria-tabs/, the ARIA accessibility attributes may not be as useful as we might assume. However, that post was written 5 years ago, so it may no longer be relevant. Any assumptions should be tested with real users.

For the sake of this exercise, I will proceed on the assumption that the attributes are indeed useful now in 2021.
