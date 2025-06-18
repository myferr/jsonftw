export function initRouter(renderFn) {
  window.addEventListener("hashchange", () => {
    renderFn(routeToFile());
  });
  renderFn(routeToFile());
}

function routeToFile() {
  const hash = window.location.hash || "#/";
  const path = hash.slice(1).replace(/\/$/, "");
  const route = path === "" ? "home" : path;
  return `./routes/${route}.json`;
}
