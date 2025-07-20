import React from "react";

export function useAsyncDefaultValues(value: unknown) {
  const firstRender = React.useRef(true);
  const [key, setKey] = React.useState(0);

  React.useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    setKey((s) => s + 1);
  }, [value]);

  return key;
}
