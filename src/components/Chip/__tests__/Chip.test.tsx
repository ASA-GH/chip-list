import { render, screen, fireEvent } from "@testing-library/react";
import { Chip } from "../Chip";

jest.mock("../Chip.module.less", () => ({
  chip: "chip",
  selected: "selected",
  disabled: "disabled",
}));

const MOCK_CONTENT = "Чипс 1";

describe("ChipSlot Component", () => {
  it("should render correct content text", () => {
    render(<Chip content={MOCK_CONTENT} />);
    expect(screen.getByText(MOCK_CONTENT)).toBeInTheDocument();
  });

  it("should trigger onClick callback when clicked", () => {
    const handleClick = jest.fn();
    render(<Chip content={MOCK_CONTENT} onClick={handleClick} />);

    fireEvent.click(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("should apply 'selected' class when 'selected' prop is true", () => {
    const { container } = render(
      <Chip content={MOCK_CONTENT} selected={true} />,
    );
    const button = container.querySelector("button");

    expect(button).toHaveClass("chip");
    expect(button).toHaveClass("selected");
  });

  it("should accept and apply custom className", () => {
    const { container } = render(
      <Chip content={MOCK_CONTENT} className="custom-class" />,
    );
    expect(container.querySelector("button")).toHaveClass("custom-class");
  });

  it("should have type='button' attribute for accessibility", () => {
    render(<Chip content={MOCK_CONTENT} />);
    expect(screen.getByRole("button")).toHaveAttribute("type", "button");
  });

  it("should not trigger onClick when disabled", () => {
    const handleClick = jest.fn();
    render(
      <Chip content={MOCK_CONTENT} onClick={handleClick} disabled={true} />,
    );
    const button = screen.getByRole("button");
    expect(button).toBeDisabled();

    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it("should apply 'disabled' class when 'disabled' prop is true", () => {
    const { container } = render(
      <Chip content={MOCK_CONTENT} disabled={true} />,
    );
    expect(container.querySelector("button")).toHaveClass("disabled");
  });
});
