import { renderHook, fireEvent } from "@testing-library/react";
import { useKeyDown } from "../useKeyDown";

describe("useKeyDown Hook", () => {
  it("should call callback when the specified key is pressed", () => {
    const callback = jest.fn();
    renderHook(() => useKeyDown("Escape", callback));

    fireEvent.keyDown(window, { key: "Escape" });
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("should not call callback when a different key is pressed", () => {
    const callback = jest.fn();
    renderHook(() => useKeyDown("Escape", callback));

    fireEvent.keyDown(window, { key: "Enter" });
    expect(callback).not.toHaveBeenCalled();
  });

  it("should not attach event listener when active is false", () => {
    const callback = jest.fn();
    renderHook(() => useKeyDown("Escape", callback, false));

    fireEvent.keyDown(window, { key: "Escape" });
    expect(callback).not.toHaveBeenCalled();
  });

  it("should remove event listener when component unmounts", () => {
    const callback = jest.fn();
    const { unmount } = renderHook(() => useKeyDown("Escape", callback));
    unmount();

    fireEvent.keyDown(window, { key: "Escape" });
    expect(callback).not.toHaveBeenCalled();
  });
  it("should not re-subscribe to window when callback changes", () => {
    const addSpy = jest.spyOn(window, "addEventListener");
    const { rerender } = renderHook(({ cb }) => useKeyDown("Escape", cb), {
      initialProps: { cb: () => {} },
    });

    rerender({ cb: () => console.log("new") });
    expect(addSpy).toHaveBeenCalledTimes(1);
    addSpy.mockRestore();
  });
});
