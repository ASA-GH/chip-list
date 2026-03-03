import "@testing-library/jest-dom";
import { render, screen, fireEvent, act, within } from "@testing-library/react";
import { ChipList } from "../ChipList";
import { generateChips } from "@/utils";

let observerCallback: ResizeObserverCallback;
global.ResizeObserver = jest.fn().mockImplementation((cb) => {
  observerCallback = cb;
  return { observe: jest.fn(), disconnect: jest.fn(), unobserve: jest.fn() };
});

const MOCK_CHIPS = generateChips("Чипс", 3);
const SINGLE_CHIP_MOCK = generateChips("Чипс", 1);
const FIRST_ID = "Чипс 1";
const LAST_ID = "Чипс 3";

describe("ChipList Component", () => {
  jest.mock("@/components/ChipList/ChipList.module.less", () => ({
    container: "container",
    list: "list",
    slot: "slot",
    gap: "gap",
    hidden: "hidden",
    moreBtn: "moreBtn",
    popupListChips: "popupListChips",
    popupSlot: "popupSlot",
  }));
  const triggerResize = () => {
    act(() => {
      observerCallback([], {} as ResizeObserver);
    });
  };

  it("should render list of chips when component mounts", () => {
    render(<ChipList chips={MOCK_CHIPS} />);
    triggerResize();
    expect(screen.getByText(FIRST_ID)).toBeInTheDocument();
  });

  it("should call onChipSelect when chip is clicked", () => {
    const handleSelect = jest.fn();
    render(<ChipList chips={MOCK_CHIPS} onChipSelect={handleSelect} />);
    triggerResize();

    fireEvent.click(screen.getByText(FIRST_ID));
    expect(handleSelect).toHaveBeenCalledWith(FIRST_ID);
  });

  it("should add hidden class to overflowing items when container is too narrow", () => {
    const { container } = render(<ChipList chips={MOCK_CHIPS} />);

    const listElement = container.querySelector("ul")!;
    const slots = screen
      .getAllByRole("listitem")
      .filter((li) => li.hasAttribute("data-chip-slot"));

    Object.defineProperty(listElement, "offsetWidth", {
      value: 100,
      configurable: true,
    });

    slots.forEach((slot) => {
      Object.defineProperty(slot, "offsetWidth", {
        value: 80,
        configurable: true,
      });
    });

    const moreBtn = screen.getByText("\u22EF").closest("li")!;
    Object.defineProperty(moreBtn, "offsetWidth", {
      value: 40,
      configurable: true,
    });
    triggerResize();

    const hasHidden = slots.some((slot) => slot.classList.contains("hidden"));
    expect(hasHidden).toBe(true);
  });

  it("should open popup with hidden chips when more button is clicked", () => {
    const { container } = render(<ChipList chips={MOCK_CHIPS} />);

    const listElement = container.querySelector("ul")!;
    const moreBtn = screen.getByText("\u22EF");
    const moreBtnLi = moreBtn.closest("li")!;
    Object.defineProperty(listElement, "offsetWidth", {
      value: 100,
      configurable: true,
    });
    Object.defineProperty(moreBtnLi, "offsetWidth", {
      value: 40,
      configurable: true,
    });

    const slots = container.querySelectorAll("[data-chip-slot]");
    slots.forEach((slot) => {
      Object.defineProperty(slot, "offsetWidth", {
        value: 80,
        configurable: true,
      });
    });

    act(() => {
      observerCallback([], {} as ResizeObserver);
    });

    expect(slots[1]).toHaveClass("hidden");

    fireEvent.click(moreBtn);
    const lists = screen.getAllByRole("list", { queryFallbacks: true });
    const popupList = lists[lists.length - 1];
    expect(within(popupList).getByText("Чипс 2")).toBeInTheDocument();
  });

  it("should close popup when all chips become visible", () => {
    const { rerender } = render(<ChipList chips={MOCK_CHIPS} />);
    triggerResize();

    fireEvent.click(screen.getByText("\u22EF"));
    expect(screen.getByText(LAST_ID)).toBeInTheDocument();

    rerender(<ChipList chips={SINGLE_CHIP_MOCK} />);
    triggerResize();
    expect(screen.queryByText(LAST_ID)).not.toBeInTheDocument();
  });
});

describe("Chip  Component", () => {
  jest.mock("@/components/Chip/Chip.module.less", () => ({
    chip: "chip",
    selected: "selected",
  }));
  const triggerResize = () => {
    act(() => {
      observerCallback([], {} as ResizeObserver);
    });
  };

  it("should apply selected class when chip id is in selectedIds", () => {
    const { container } = render(
      <ChipList chips={MOCK_CHIPS} selectedIds={[FIRST_ID]} />,
    );
    const listElement = container.querySelector("ul")!;
    Object.defineProperty(listElement, "offsetWidth", {
      value: 50,
      configurable: true,
    });
    triggerResize();

    const chipButton = screen.getByText(FIRST_ID);
    expect(chipButton).toHaveClass("selected");
  });
});
