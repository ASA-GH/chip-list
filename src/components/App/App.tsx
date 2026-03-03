import React, { useCallback, useState } from "react";
import { ChipList } from "../ChipList";
import { generateChips } from "@/utils";
import styles from "./App.module.less";

const CHIPS = generateChips("Чипс", 13);

export const App = () => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const handleChipSelect = useCallback((id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  }, []);

  return (
    <div className={styles.app}>
      <div className={styles.container}>
        <ChipList
          chips={CHIPS}
          selectedIds={selectedIds}
          onChipSelect={handleChipSelect}
        />
      </div>
    </div>
  );
};
