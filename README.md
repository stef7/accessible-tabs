# Accessible Tabs

This application uses Next.js/React to run my accessible tabs component.

To begin, run either `npm install` or `yarn` to install all the package dependencies.

## Using the TabSet component

The `TabSet` component was built with full Typescript support. It accepts the following properties:

|Prop|Purpose|
|-|-|
|uniqueName|A name for this particular instance of the tab set. This should be unique, as it is turned into a "slug" which will become the unique identifier used in URLs.
|tabs|An array of tab objects with the following properties:
* uniqueName: A name for this particular tab. Must also be unique -- similar rules and usage as tab sets.
* content: A React.ReactNode or JSX.Element object.

|options|A configuration object determining the behaviour of the component:

* uniqueName: A name for this particular tab. Must also be unique -- similar rules and usage as tab sets.
* content: A React.ReactNode or JSX.Element object.|


Example:
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

## Running component tests

TBC

## Notes on real-world accessibility

According to this article from https://simplyaccessible.com/article/danger-aria-tabs/, the ARIA accessibility attributes may not be as useful as we might assume. However, that post was written 5 years ago, so it may no longer be relevant. Any assumptions should be tested with real users.

For the sake of this exercise, I will proceed on the assumption that the attributes are indeed useful now in 2021.
