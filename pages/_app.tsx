import "../styles/globals.scss";
import { AppWrapper } from "../lib/context";

function Application({ Component, pageProps }) {
	return (
		<AppWrapper>
			<Component {...pageProps} />
		</AppWrapper>
	);
}

export default Application;
