# jsonftw

> JSON for the Web — a tiny declarative frontend framework using pure JSON to describe your UI, events, and behavior.

---

## What is jsonftw?

**jsonftw** is a minimal web framework that renders your application UI using only JSON definitions. It supports:

- Declarative UI via JSON
- CSS injection
- Nested DOM structures
- Inline JavaScript behavior (like `onClick`)
- Page-level script execution
- Hash-based client-side routing

It’s perfect for building **visual editors**, **low-code platforms**, **documentation UIs**, or any project where UI should be **data-defined**.

## Installation

To use jsonftw in a project:

```

npm install jsonftw     # Install
npx jsonftw@latest      # Scaffold new project using JSONFTW

```

## Usage

### 1. Create a container in your HTML

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <title>jsonftw App</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="./main.js"></script>
  </body>
</html>
```

### 2. Import and start the framework

```js
// main.js
import { startJsonFTW } from "jsonftw";
startJsonFTW();
```

### 3. Add a `routes/home.json` file

```json
{
  "cssFile": "styles.css",
  "renderOn": "app",
  "view": [
    {
      "type": "div",
      "identifier": "container",
      "class": "wrapper"
    },
    {
      "type": "h1",
      "identifier": "main-title",
      "innerText": "Welcome to jsonftw",
      "insideOf": {
        "childElement": true,
        "parentElement": "container"
      }
    },
    {
      "type": "button",
      "identifier": "click-button",
      "innerText": "Click Me",
      "onClick": "alert('Hello from jsonftw!');",
      "insideOf": {
        "childElement": true,
        "parentElement": "container"
      }
    }
  ],
  "javascript": "console.log('Page loaded');"
}
```

### 4. Enable routing with hash links

```html
<a href="#/">Home</a> <a href="#/about">About</a>
```

---

## JSON Schema Reference

Each route is a `.json` file with the following structure:

| Field        | Type     | Required | Description                                      |
| ------------ | -------- | -------- | ------------------------------------------------ |
| `cssFile`    | `string` | optional | Path to an external stylesheet to load           |
| `renderOn`   | `string` | optional | DOM `id` to render into (default: `app`)         |
| `view`       | `array`  | ✅       | A list of DOM element definitions                |
| `javascript` | `string` | optional | Page-level inline JavaScript to run after render |

---

### Element Definition (`view[]`)

| Field         | Type     | Required | Description                                                                  |
| ------------- | -------- | -------- | ---------------------------------------------------------------------------- |
| `type`        | `string` | ✅       | HTML element tag (e.g., `div`, `h1`, `input`)                                |
| `identifier`  | `string` | ✅       | Unique key used internally for nesting                                       |
| `class`       | `string` | optional | `class` attribute                                                            |
| `id`          | `string` | optional | `id` attribute                                                               |
| `style`       | `string` | optional | Inline style (e.g., `"color: red;"`)                                         |
| `innerText`   | `string` | optional | Text content                                                                 |
| `value`       | `string` | optional | For input elements                                                           |
| `src`         | `string` | optional | For `img`, `video`, `iframe`, etc.                                           |
| `href`        | `string` | optional | For `a` tags                                                                 |
| `placeholder` | `string` | optional | For inputs                                                                   |
| `onClick`     | `string` | optional | Inline JS for `click` handler                                                |
| `insideOf`    | `object` | optional | Nest inside a parent element (`{ childElement: true, parentElement: "id" }`) |

## Example Output

Given the JSON:

```json
{
  "view": [
    {
      "type": "div",
      "identifier": "wrapper"
    },
    {
      "type": "h1",
      "innerText": "Hello World",
      "identifier": "title",
      "insideOf": { "childElement": true, "parentElement": "wrapper" }
    }
  ]
}
```

Output DOM:

```html
<div data-identifier="wrapper">
  <h1 data-identifier="title">Hello World</h1>
</div>
```

## Advanced Features

### ✅ CSS injection

Set a `cssFile` in your route JSON and it will be `<link>`-injected into `<head>` if not already loaded.

### ✅ Routing

Uses `window.location.hash` to route to `routes/<page>.json`.

Examples:

- `#/` → `routes/home.json`
- `#/about` → `routes/about.json`

### ✅ JavaScript execution

You can include a string of JS in:

- `onClick`
- `javascript` (top-level)

It will be evaluated using `new Function(...)`.

## File Structure Example

```
my-app/
├── index.html
├── main.js
├── routes/
│   └── home.json
├── styles.css
├── node_modules/
└── package.json
```

## License

MIT — free to use and modify.

## Feedback / Contributions

Feel free to open issues or PRs!
jsonftw is built to be hackable and extendable.
