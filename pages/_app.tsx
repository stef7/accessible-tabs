import React, { createContext, useReducer } from "react";
import "../styles/globals.scss";

export const AppContext = createContext(null);

function Application({ Component, pageProps }) {
	const tabSets = useReducer((state, tabsetKey) => ({
		...state,
		[tabsetKey]: state[tabsetKey] === undefined ? 0 : state[tabsetKey] + 1,
	}), {});

	return (
		<AppContext.Provider value={{ tabSets }}>
			<Component {...pageProps} />
		</AppContext.Provider>
	);
}

export default Application;
