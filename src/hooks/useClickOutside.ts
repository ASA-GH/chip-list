import { useEffect, useRef, RefObject } from "react";

export const useClickOutside = <T extends HTMLElement = HTMLElement>(
  ref: RefObject<T | null>,
  handler: () => void,
  enabled: boolean = true,
  ignoreRef?: RefObject<HTMLElement | null>,
) => {
  const handlerRef = useRef(handler);
  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  useEffect(() => {
    if (!enabled) return;
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (!target) return;
      if (ref.current?.contains(target)) return;
      if (ignoreRef?.current?.contains(target)) return;
      handlerRef.current();
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [ref, enabled, ignoreRef]);
};
