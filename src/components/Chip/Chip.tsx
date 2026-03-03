import React, { memo, ReactNode } from "react";
import { createClasses } from "@/utils";
import styles from "./Chip.module.less";

interface ChipProps {
  content?: string | ReactNode;
  selected?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
}

export const Chip: React.FC<ChipProps> = memo(
  ({ content, selected = false, disabled = false, onClick, className }) => {
    return (
      <button
        className={createClasses(
          styles.chip,
          selected && styles.selected,
          disabled && styles.disabled,
          className,
        )}
        onClick={disabled ? undefined : onClick}
        disabled={disabled}
        type="button"
      >
        {content}
      </button>
    );
  },
);
Chip.displayName = "Chip";
