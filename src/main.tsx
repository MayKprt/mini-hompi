import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App.tsx";
import "./styles.css";
import "./hompi-extras.css";
import {isPortfolioMode} from "./locale";

const portfolio = isPortfolioMode(location.search);
document.documentElement.lang = portfolio ? "en" : "ko";
document.documentElement.classList.toggle("portfolio-mode", portfolio);

if (document.documentElement.dataset.miniroomView === "embed" || /^\/embed(?:\/|$)/.test(location.pathname)) {
  document.documentElement.classList.add("embed-document");
  document.title = portfolio ? "Interactive Miniroom" : "봄이의 미니룸";
}

if (!document.documentElement.classList.contains("embed-document")) {
  document.title = portfolio ? "Bomi’s Mini Hompi" : "봄이의 미니홈피 · mini hompi";
}
document.querySelector('meta[name="description"]')?.setAttribute("content", portfolio
  ? "A cozy interactive miniroom. Click to walk, wave, sit, and change the lights."
  : "봄이의 작은 미니룸. 미니미와 인사하고 포근한 방에서 쉬어 가세요.");

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App portfolio={portfolio} embedded={document.documentElement.dataset.miniroomView === "embed" || /^\/embed(?:\/|$)/.test(location.pathname)} />
  </React.StrictMode>,
);
