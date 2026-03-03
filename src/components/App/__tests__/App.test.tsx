import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { App } from "../App";

describe("App Component", () => {
  it("should toggle chip selection on click", () => {
    render(<App />);
    const chip = screen.getByText("Чипс 1");
    fireEvent.click(chip);
    fireEvent.click(chip);
  });
});
