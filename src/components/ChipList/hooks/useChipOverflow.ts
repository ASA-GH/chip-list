import { useState, useRef, useLayoutEffect } from "react";
import styles from "@/components/ChipList/ChipList.module.less";

export const useChipOverflow = (
  chipsCount: number,
  setIsPopupOpen?: (isOpen: boolean) => void,
  isPopupOpen?: boolean,
) => {
  const containerRef = useRef<HTMLUListElement>(null);
  const moreBtnRef = useRef<HTMLLIElement>(null);
  const isPopupOpenRef = useRef(isPopupOpen);
  isPopupOpenRef.current = isPopupOpen;
  const widthCache = useRef<number[]>([]);
  const moreBtnWidthRef = useRef<number>(0);
  const lastWidthRef = useRef<number>(0);
  const [lastVisibleIndex, setLastVisibleIndex] = useState<number>(
    chipsCount - 1,
  );

  useLayoutEffect(() => {
    const container = containerRef.current;
    const moreBtn = moreBtnRef.current;

    if (!container || !moreBtn || chipsCount === 0) {
      setLastVisibleIndex(-1);
      return;
    }

    const calculate = () => {
      if (!container) return;
      const containerWidth = container.offsetWidth;
      if (
        lastWidthRef.current !== 0 &&
        lastWidthRef.current !== containerWidth
      ) {
        if (isPopupOpenRef.current && setIsPopupOpen) {
          setIsPopupOpen(false);
        }
      }
      lastWidthRef.current = containerWidth;
      const chipSlots = Array.from(
        container.querySelectorAll("[data-chip-slot]"),
      ) as HTMLElement[];

      if (chipSlots.length === 0) return;
      const checkIndex = chipsCount > 1 ? 1 : 0;
      const currentCheckWidth = chipSlots[checkIndex]?.offsetWidth;

      if (
        widthCache.current.length > 0 &&
        currentCheckWidth !== widthCache.current[checkIndex]
      ) {
        widthCache.current = [];
      }

      if (widthCache.current.length === 0) {
        container.classList.add(styles.isMeasuring);
        widthCache.current = chipSlots.map((slot) => slot.offsetWidth);
        moreBtnWidthRef.current = moreBtn.offsetWidth;
        container.classList.remove(styles.isMeasuring);
      }

      const moreBtnWidth = moreBtnWidthRef.current;
      let currentWidth = 0;
      let newLastIndex = -1;
      let isOverflow = false;

      for (let i = 0; i < widthCache.current.length; i++) {
        const slotWidth = widthCache.current[i];
        const isLast = i === chipsCount - 1;
        const spaceNeeded =
          currentWidth + slotWidth + (isLast ? 0 : moreBtnWidth);

        if (spaceNeeded <= containerWidth) {
          currentWidth += slotWidth;
          newLastIndex = i;
        } else {
          isOverflow = true;
          break;
        }
      }
      setLastVisibleIndex(isOverflow ? newLastIndex : chipsCount - 1);
    };
    widthCache.current = [];
    calculate();

    const ro = new ResizeObserver(calculate);
    ro.observe(container);
    return () => ro.disconnect();
  }, [chipsCount, setIsPopupOpen]);

  return { containerRef, moreBtnRef, lastVisibleIndex };
};
