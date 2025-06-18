import { initRouter } from "./router.js";
import { renderRoute } from "./renderer.js";

export function startJsonFTW() {
  window.addEventListener("DOMContentLoaded", () => {
    initRouter(renderRoute);
  });
}
