import React from "react";
import "../styles/globals.scss";

export default function Application({ Component, pageProps }) {
	return <Component {...pageProps} />;
}
