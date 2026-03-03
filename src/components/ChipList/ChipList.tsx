import React, { useState, useEffect, useCallback, useMemo, memo } from "react";
import { Popup } from "../Popup";
import { useChipOverflow } from "@/components/ChipList/hooks/useChipOverflow";
import { createClasses } from "@/utils";
import { ChipSlot } from "@/components/ChipSlot";
import { ChipsList } from "@/types";
import styles from "./ChipList.module.less";

interface ChipListProps {
  chips: ChipsList | [];
  selectedIds?: string[];
  onChipSelect?: (id: string) => void;
  className?: string;
}

export const ChipList: React.FC<ChipListProps> = memo(
  ({ chips, selectedIds = [], onChipSelect, className }) => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const { containerRef, moreBtnRef, lastVisibleIndex } = useChipOverflow(
      chips.length,
      setIsPopupOpen,
      isPopupOpen,
    );

    const handleChipClick = useCallback(
      (id?: string) => {
        if (id) {
          onChipSelect?.(id);
        }
      },
      [onChipSelect],
    );

    const togglePopup = useCallback(() => {
      setIsPopupOpen((prev) => !prev);
    }, []);

    const hiddenChips = useMemo(
      () => chips.slice(lastVisibleIndex + 1),
      [chips, lastVisibleIndex],
    );

    const isShowBtnMore = chips.length > 0 && hiddenChips.length > 0;

    useEffect(() => {
      if (hiddenChips.length === 0 && isPopupOpen) setIsPopupOpen(false);
    }, [hiddenChips.length, isPopupOpen]);

    return (
      <div className={createClasses(styles.container, className)}>
        <ul ref={containerRef} className={styles.list}>
          {chips.map(({ id, content }, index) => (
            <ChipSlot
              key={id}
              className={createClasses(
                styles.slot,
                index > 0 && styles.gap,
                index > lastVisibleIndex && styles.hidden,
              )}
              marker={"data-chip-slot"}
              id={id}
              content={content}
              onClick={handleChipClick}
              selected={selectedIds.includes(id)}
            />
          ))}
          {chips.length > 0 && (
            <ChipSlot
              key="more-button"
              ref={moreBtnRef}
              className={createClasses(
                styles.moreBtn,
                !isShowBtnMore && styles.hidden,
              )}
              content={<span className={styles.dots}>{"\u22EF"}</span>}
              onClick={togglePopup}
            />
          )}
        </ul>
        <Popup
          isOpen={isPopupOpen}
          onClose={() => setIsPopupOpen(false)}
          anchorRef={moreBtnRef}
          className={styles.popup}
        >
          <ul className={styles.popupListChips}>
            {hiddenChips.map(({ id, content }) => (
              <ChipSlot
                key={id}
                className={styles.popupSlot}
                id={id}
                content={content}
                onClick={handleChipClick}
                selected={selectedIds.includes(id)}
              />
            ))}
          </ul>
        </Popup>
      </div>
    );
  },
);

ChipList.displayName = "ChipList";
