import React, { createContext } from "react";
import "../styles/globals.scss";
import { getTabSetsContextValue } from "../components/TabSet";

export const AppContext = createContext(null);

export default function Application({ Component, pageProps }): JSX.Element {
	return (
		<AppContext.Provider value={{ tabSets: getTabSetsContextValue() }}>
			<Component {...pageProps} />
		</AppContext.Provider>
	);
}
