import { render, screen, fireEvent } from "@testing-library/react";
import React, { createRef } from "react";
import { ChipSlot } from "../ChipSlot";

const MOCK_CONTENT = "Чипс 1";
const MOCK_ID = "1";
const MOCK_MARKER = "data-chip-slot";

describe("ChipSlot Component", () => {
  it("should correctly forward ref to the li element when ref prop is provided", () => {
    const ref = createRef<HTMLLIElement>();
    render(
      <ChipSlot
        content={MOCK_CONTENT}
        id={MOCK_ID}
        onClick={jest.fn()}
        selected={false}
        ref={ref}
      />,
    );

    expect(ref.current).toBeInstanceOf(HTMLLIElement);
    expect(ref.current?.tagName).toBe("LI");
  });

  it("should add attribute named by marker prop when marker is provided", () => {
    const { rerender, container } = render(
      <ChipSlot
        content={MOCK_CONTENT}
        id={MOCK_ID}
        onClick={jest.fn()}
        selected={false}
        marker={MOCK_MARKER}
      />,
    );
    expect(container.querySelector("li")).toHaveAttribute(MOCK_MARKER, "true");

    rerender(
      <ChipSlot
        content={MOCK_CONTENT}
        id={MOCK_ID}
        onClick={jest.fn()}
        selected={false}
        marker={undefined}
      />,
    );
    expect(container.querySelector("li")).not.toHaveAttribute(MOCK_MARKER);
  });
  it("should call onClick with the provided id when clicked", () => {
    const onClick = jest.fn();
    render(
      <ChipSlot
        content={MOCK_CONTENT}
        id={MOCK_ID}
        onClick={onClick}
        selected={false}
      />,
    );

    fireEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledWith(MOCK_ID);
  });

  it("should not recreate handleClick when unrelated props change", () => {
    const onClick = jest.fn();
    const { rerender } = render(
      <ChipSlot
        content={MOCK_CONTENT}
        id={MOCK_ID}
        onClick={onClick}
        selected={false}
      />,
    );

    rerender(
      <ChipSlot
        content={MOCK_CONTENT}
        id={MOCK_ID}
        onClick={onClick}
        selected={true}
      />,
    );
    fireEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledWith(MOCK_ID);
  });
});
