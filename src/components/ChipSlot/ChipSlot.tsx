import React, { forwardRef, memo, ReactNode, useCallback } from "react";
import { Chip } from "@/components/Chip";

interface ChipSlotProps {
  className?: string;
  marker?: string;
  id?: string;
  content: string | ReactNode;
  onClick: (id?: string) => void;
  selected?: boolean;
}

export const ChipSlot = memo(
  forwardRef<HTMLLIElement, ChipSlotProps>(
    ({ className, marker, id, content, onClick, selected }, ref) => {
      const handleClick = useCallback(() => onClick(id), [id, onClick]);

      return (
        <li
          ref={ref}
          className={className}
          {...(marker ? { [marker]: true } : {})}
        >
          <Chip content={content} selected={selected} onClick={handleClick} />
        </li>
      );
    },
  ),
);

ChipSlot.displayName = "ChipSlot";
