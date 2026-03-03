import { renderHook, act } from "@testing-library/react";
import { useChipOverflow } from "../hooks/useChipOverflow";

let observerCallback: ResizeObserverCallback = () => {};
global.ResizeObserver = jest
  .fn()
  .mockImplementation((cb: ResizeObserverCallback) => {
    observerCallback = cb;
    return { observe: jest.fn(), disconnect: jest.fn(), unobserve: jest.fn() };
  });

jest.mock("@/components/ChipList/ChipList.module.less", () => ({
  isMeasuring: "isMeasuring",
}));

describe("useChipOverflow Hook", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    jest.clearAllMocks();
  });

  const setupDOM = (containerWidth: number, chipWidths: number[]) => {
    const container = document.createElement("ul");
    const moreBtn = document.createElement("li");

    container.getBoundingClientRect = () =>
      ({ width: containerWidth }) as DOMRect;
    Object.defineProperty(container, "offsetWidth", {
      value: containerWidth,
      configurable: true,
    });

    Object.defineProperty(moreBtn, "offsetWidth", {
      value: 50,
      configurable: true,
    });

    chipWidths.forEach((w) => {
      const chip = document.createElement("li");
      chip.setAttribute("data-chip-slot", "");
      Object.defineProperty(chip, "offsetWidth", {
        value: w,
        configurable: true,
      });
      container.appendChild(chip);
    });
    container.appendChild(moreBtn);
    document.body.appendChild(container);

    return { container, moreBtn };
  };

  it("should call setIsPopupOpen with false when container width changes", () => {
    const setIsPopupOpen = jest.fn();
    const { container, moreBtn } = setupDOM(500, [100, 100, 100]);

    const { result, rerender } = renderHook(
      ({ count, isOpen }) => useChipOverflow(count, setIsPopupOpen, isOpen),
      { initialProps: { count: 0, isOpen: true } },
    );

    result.current.containerRef.current = container;
    result.current.moreBtnRef.current = moreBtn;
    act(() => {
      rerender({ count: 3, isOpen: true });
    });
    act(() => {
      observerCallback([], {} as ResizeObserver);
    });
    Object.defineProperty(container, "offsetWidth", {
      value: 300,
      configurable: true,
    });
    act(() => {
      observerCallback([], {} as ResizeObserver);
    });

    expect(setIsPopupOpen).toHaveBeenCalledWith(false);
  });

  it("should hide chips correctly when they do not fit the container", () => {
    const { container, moreBtn } = setupDOM(220, [100, 100, 100]);

    const { result, rerender } = renderHook(
      ({ count }) => useChipOverflow(count, jest.fn(), false),
      { initialProps: { count: 0 } },
    );
    result.current.containerRef.current = container;
    result.current.moreBtnRef.current = moreBtn;

    act(() => {
      rerender({ count: 3 });
    });

    act(() => {
      observerCallback([], {} as ResizeObserver);
    });

    expect(result.current.lastVisibleIndex).toBe(0);
  });

  it("should return -1 when there are no chips provided", () => {
    const { result } = renderHook(() => useChipOverflow(0));
    expect(result.current.lastVisibleIndex).toBe(-1);
  });

  it("should show all items when they fully fit the container", () => {
    const { container, moreBtn } = setupDOM(300, [100, 100, 100]);
    const { result, rerender } = renderHook(
      ({ count }) => useChipOverflow(count),
      {
        initialProps: { count: 0 },
      },
    );

    result.current.containerRef.current = container;
    result.current.moreBtnRef.current = moreBtn;

    act(() => {
      rerender({ count: 3 });
    });
    act(() => {
      observerCallback([], {} as ResizeObserver);
    });

    expect(result.current.lastVisibleIndex).toBe(2);
  });

  it("should reset cache and recalculate indices when element widths change", () => {
    const { container, moreBtn } = setupDOM(250, [100, 100]);
    const { result, rerender } = renderHook(
      ({ count }) => useChipOverflow(count),
      {
        initialProps: { count: 0 },
      },
    );

    result.current.containerRef.current = container;
    result.current.moreBtnRef.current = moreBtn;

    act(() => {
      rerender({ count: 2 });
    });
    act(() => {
      observerCallback([], {} as ResizeObserver);
    });
    expect(result.current.lastVisibleIndex).toBe(1);
    const chips = container.querySelectorAll("[data-chip-slot]");
    chips.forEach((chip) => {
      Object.defineProperty(chip, "offsetWidth", {
        value: 150,
        configurable: true,
      });
    });

    act(() => {
      observerCallback([], {} as ResizeObserver);
    });
    expect(result.current.lastVisibleIndex).toBe(0);
  });

  it("should return -1 when even a single chip does not fit with the more button", () => {
    const { container, moreBtn } = setupDOM(100, [120, 100, 100]);
    const { result, rerender } = renderHook(
      ({ count }) => useChipOverflow(count, jest.fn(), false),
      { initialProps: { count: 0 } },
    );
    result.current.containerRef.current = container;
    result.current.moreBtnRef.current = moreBtn;

    act(() => {
      rerender({ count: 3 });
    });

    act(() => {
      observerCallback([], {} as ResizeObserver);
    });
    expect(result.current.lastVisibleIndex).toBe(-1);
  });

  it("should not throw an error when setIsPopupOpen is not provided", () => {
    const { container, moreBtn } = setupDOM(500, [100, 100, 100]);
    const { result, rerender } = renderHook(
      ({ count }) => useChipOverflow(count),
      { initialProps: { count: 0 } },
    );

    result.current.containerRef.current = container;
    result.current.moreBtnRef.current = moreBtn;

    act(() => {
      rerender({ count: 3 });
    });

    Object.defineProperty(container, "offsetWidth", {
      value: 300,
      configurable: true,
    });

    expect(() => {
      act(() => {
        observerCallback([], {} as ResizeObserver);
      });
    }).not.toThrow();

    expect(result.current.lastVisibleIndex).toBeGreaterThan(-1);
  });
});
