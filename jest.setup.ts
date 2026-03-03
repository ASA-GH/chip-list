import "@testing-library/jest-dom";
// import "@testing-library/jest-dom/jest-globals"; // Добавь /jest-globals
import ResizeObserver from "resize-observer-polyfill";

global.ResizeObserver = ResizeObserver;
