import React, { useRef, useState, useLayoutEffect } from "react";
import ReactDOM from "react-dom";
import { useClickOutside } from "@/hooks/useClickOutside";
import { useKeyDown } from "@/hooks/useKeyDown";
import { createClasses } from "@/utils";
import styles from "./Popup.module.less";

interface PopupProps {
  children: React.ReactNode;
  onClose: () => void;
  isOpen: boolean;
  anchorRef?: React.RefObject<HTMLElement | null>; // Добавляем ссылку на кнопку
  className?: string;
}

export const Popup: React.FC<PopupProps> = ({
  children,
  onClose,
  isOpen,
  anchorRef,
  className,
}) => {
  const popupRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ top: 0, left: 0 });

  useKeyDown("Escape", onClose, isOpen);
  useClickOutside(popupRef, onClose, isOpen, anchorRef);

  useLayoutEffect(() => {
    if (!isOpen || !anchorRef?.current) return;

    if (anchorRef.current) {
      const rect = anchorRef.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom + window.scrollY + 6,
        left: rect.right + window.scrollX + 6,
      });
    }
  }, [isOpen, anchorRef]);

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div
      ref={popupRef}
      className={createClasses(styles.popup, className)}
      style={{
        top: `${coords.top}px`,
        left: `${coords.left}px`,
        transform: "translateX(-100%)",
      }}
      role="dialog"
    >
      <div className={styles.content}>{children}</div>
    </div>,
    document.body,
  );
};
Popup.displayName = "Popup";
