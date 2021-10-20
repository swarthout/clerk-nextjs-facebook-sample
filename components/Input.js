import React from "react";
import styles from "./Input.module.css";

const Input = React.forwardRef(({ helperText, errorText, onPaste, ...rest }, ref) => {
  return (
    <>
      <input onPaste={onPaste} className={styles.input} ref={ref} {...rest} />
      {errorText && <span className={styles.errorText}>{errorText}</span>}
      {helperText && <span className={styles.helperText}>{helperText}</span>}
    </>
  );
});

Input.displayName = "Input";

export { Input };
