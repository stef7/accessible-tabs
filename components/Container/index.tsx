import React, { PropsWithChildren } from "react";

import styles from "./index.module.scss";

const Container: React.FC<PropsWithChildren<unknown>> = function ({ children }) {
	return <div className={styles.container}>{children}</div>;
};
export default Container;
