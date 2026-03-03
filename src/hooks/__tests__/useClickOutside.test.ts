import { renderHook, act } from "@testing-library/react";
import { fireEvent } from "@testing-library/react";
import { useClickOutside } from "../useClickOutside";

describe("useClickOutside Hook", () => {
  const createRef = (el: HTMLElement | null) => ({ current: el });

  it("should call handler when clicking outside the element", () => {
    const handler = jest.fn();
    const element = document.createElement("div");
    const outside = document.createElement("span");
    document.body.appendChild(element);
    document.body.appendChild(outside);
    renderHook(() => useClickOutside(createRef(element), handler));

    fireEvent.mouseDown(outside);
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it("should not call handler when clicking inside the element", () => {
    const handler = jest.fn();
    const element = document.createElement("div");
    const inside = document.createElement("span");
    element.appendChild(inside);
    document.body.appendChild(element);
    renderHook(() => useClickOutside(createRef(element), handler));

    fireEvent.mouseDown(inside);
    expect(handler).not.toHaveBeenCalled();
  });

  it("should not call handler when ignoreRef is clicked", () => {
    const handler = jest.fn();
    const element = document.createElement("div");
    const ignoreElement = document.createElement("button");
    document.body.appendChild(element);
    document.body.appendChild(ignoreElement);
    renderHook(() =>
      useClickOutside(
        createRef(element),
        handler,
        true,
        createRef(ignoreElement),
      ),
    );

    fireEvent.mouseDown(ignoreElement);
    expect(handler).not.toHaveBeenCalled();
  });

  it("should work correctly when handler changes without re-subscribing", () => {
    const addSpy = jest.spyOn(document, "addEventListener");
    const handler1 = jest.fn();
    const handler2 = jest.fn();
    const element = createRef(document.createElement("div"));

    const { rerender } = renderHook(({ h }) => useClickOutside(element, h), {
      initialProps: { h: handler1 },
    });
    rerender({ h: handler2 });
    expect(addSpy).toHaveBeenCalledTimes(1);

    fireEvent.mouseDown(document.body);
    expect(handler1).not.toHaveBeenCalled();
    expect(handler2).toHaveBeenCalledTimes(1);
    addSpy.mockRestore();
  });

  it("should remove event listener when enabled is set to false", () => {
    const removeSpy = jest.spyOn(document, "removeEventListener");
    const handler = jest.fn();
    const element = { current: document.createElement("div") };

    const { rerender } = renderHook(
      ({ enabled }) => useClickOutside(element, handler, enabled),
      { initialProps: { enabled: true } },
    );
    act(() => {
      rerender({ enabled: false });
    });
    expect(removeSpy).toHaveBeenCalled();

    fireEvent.mouseDown(document.body);
    expect(handler).not.toHaveBeenCalled();
    removeSpy.mockRestore();
  });
});
