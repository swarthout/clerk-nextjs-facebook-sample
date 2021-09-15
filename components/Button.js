import React from "react";
import styles from "./Button.module.css";

const Button = React.forwardRef(({ children, ...rest }, ref) => {
  return (
    <button type="button" {...rest} className={styles.button} ref={ref}>
      {children}
    </button>
  );
});

Button.displayName = "Button";

export { Button };
