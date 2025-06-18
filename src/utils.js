export function runScript(code) {
  try {
    new Function(code)();
  } catch (err) {
    console.error("Script error:", err);
  }
}

export function createDOMElement(el, map) {
  const dom = document.createElement(el.type);
  if (el.class) dom.className = el.class;
  if (el.id) dom.id = el.id;
  if (el.style) dom.style.cssText = el.style;
  if (el.innerText) dom.innerText = el.innerText;
  if (el.value) dom.value = el.value;
  if (el.src) dom.src = el.src;
  if (el.href) dom.href = el.href;
  if (el.placeholder) dom.placeholder = el.placeholder;
  if (el.type && el.type !== el.type.toUpperCase()) dom.type = el.type;

  if (el.onClick) {
    dom.addEventListener("click", () => {
      try {
        new Function(el.onClick)();
      } catch (e) {
        console.error("onClick error:", e);
      }
    });
  }

  dom.setAttribute("data-identifier", el.identifier);
  return dom;
}
