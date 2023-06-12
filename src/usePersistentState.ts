// Taken from https://stackoverflow.com/a/73648393/2035476

import { useEffect, useState } from "react";

export default function usePersistentState<T>(key: string, initialValue: T): [T, (value: T) => void] {
  const [state, setInternalState] = useState<T>(initialValue);

  useEffect(() => {
    const value = localStorage.getItem(key);

    if (!value) return;

    setInternalState(JSON.parse(value));
  }, [key]);

  const setState = (value: T) => {
    localStorage.setItem(key, JSON.stringify(value));
    setInternalState(value);
  };

  return [state, setState];
}
