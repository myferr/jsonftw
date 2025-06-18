import { runScript, createDOMElement } from "./utils.js";

export async function renderRoute(routeFile) {
  try {
    const res = await fetch(routeFile);
    const config = await res.json();
    const target = document.getElementById(config.renderOn || "app");
    target.innerHTML = "";

    // Add CSS
    if (config.cssFile) {
      if (!document.querySelector(`link[href="${config.cssFile}"]`)) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = config.cssFile;
        document.head.appendChild(link);
      }
    }

    const elementsMap = {};
    for (const el of config.view) {
      const dom = createDOMElement(el, elementsMap);
      elementsMap[el.identifier] = dom;
    }

    for (const el of config.view) {
      const dom = elementsMap[el.identifier];
      if (el.insideOf?.childElement) {
        const parent = elementsMap[el.insideOf.parentElement];
        parent?.appendChild(dom);
      } else {
        target.appendChild(dom);
      }
    }

    if (config.javascript) runScript(config.javascript);
  } catch (e) {
    console.error("jsonftw error:", e);
    document.getElementById("app").innerHTML = "<h1>404 - Page Not Found</h1>";
  }
}
