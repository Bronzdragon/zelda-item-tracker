import { useEffect, useRef } from "react";
import styles from "./NumberInput.module.css";
import cs from "cs";

interface NumberInputProps {
  min?: number;
  max?: number;
  step?: number;
  value?: number;
  onChange?: (num: number) => void;
  className?: string;
}

function NumberInput({ min, max, step, value, className, onChange }: NumberInputProps) {
  // Have to use a ref to hook up the '+' button
  const num = useRef(0);

  useEffect(() => {
    if (value) num.current = value;
  }, [value]);

  return (
    <span className={cs(className, styles.container)}>
      <input
        type="number"
        min={min}
        max={max}
        step={step}
        value={value ?? num.current}
        onChange={(event) => {
          num.current = Number(event.target.value);
          onChange?.(num.current);
        }}
        className={styles.numInput}
      />
      <button
        type="button"
        className={styles.button}
        onClick={() => {
          num.current++;
          onChange?.(num.current);
        }}
      >
        +
      </button>
    </span>
  );
}

export default NumberInput;
