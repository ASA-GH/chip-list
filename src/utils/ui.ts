import { ChipsList } from "@/types";

export const createClasses = (
  ...args: (string | boolean | undefined)[]
): string => {
  return args.filter(Boolean).join(" ");
};
export const generateChips = (label: string, count: number): ChipsList => {
  return Array.from({ length: count }, (_, i) => {
    const str = `${label} ${i + 1}`;
    return { id: str, content: str };
  });
};
