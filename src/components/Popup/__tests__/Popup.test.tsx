import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import { Popup } from "../Popup";

jest.mock("./Popup.module.less", () => ({
  popup: "popup",
  content: "content",
}));

describe("Popup Component", () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    document.body.innerHTML = "";
  });

  const setupAnchor = (bottom = 100, right = 200) => {
    const anchor = document.createElement("button");
    anchor.getBoundingClientRect = jest.fn(
      () =>
        ({
          bottom,
          right,
          top: bottom - 20,
          left: right - 50,
          width: 50,
          height: 20,
        }) as DOMRect,
    );
    return { current: anchor };
  };

  it("should render in portal (body) when isOpen is true", () => {
    render(
      <Popup isOpen={true} onClose={mockOnClose}>
        <div>Test Content</div>
      </Popup>,
    );

    const content = screen.getByText("Test Content");
    expect(content).toBeInTheDocument();
    expect(content.closest(".popup")?.parentElement).toBe(document.body);
  });

  it("should call onClose when Escape key is pressed", () => {
    render(
      <Popup isOpen={true} onClose={mockOnClose}>
        Content
      </Popup>,
    );
    fireEvent.keyDown(window, { key: "Escape" });
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("should calculate coordinates relative to anchorRef when rendered", () => {
    const anchorRef = setupAnchor(100, 200);

    render(
      <Popup isOpen={true} onClose={mockOnClose} anchorRef={anchorRef}>
        Content
      </Popup>,
    );

    const popup = screen.getByText("Content").closest(".popup") as HTMLElement;

    expect(popup.style.top).toBe("106px");
    expect(popup.style.left).toBe("206px");
  });

  it("should NOT call onClose when clicking on anchorRef", () => {
    const anchorRef = setupAnchor();
    render(
      <Popup isOpen={true} onClose={mockOnClose} anchorRef={anchorRef}>
        Content
      </Popup>,
    );

    fireEvent.mouseDown(anchorRef.current!);
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it("should call onClose when clicking outside the popup", () => {
    render(
      <Popup isOpen={true} onClose={mockOnClose}>
        Content
      </Popup>,
    );

    fireEvent.mouseDown(document.body);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});
