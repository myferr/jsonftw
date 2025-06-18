#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";
import { prompt } from "./utils/inquirer.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const colors = {
  cyan: (str) => `\x1b[36m${str}\x1b[0m`,
  magenta: (str) => `\x1b[35m${str}\x1b[0m`,
  bold: (str) => `\x1b[1m${str}\x1b[0m`,
};

const log = console.log;

const answers = await prompt([
  { type: "input", name: "projectName", message: "Project name" },
  { type: "confirm", name: "useVite", message: "Use Vite as dev server?" },
  { type: "confirm", name: "useTailwind", message: "Integrate TailwindCSS?" },
  { type: "confirm", name: "useRouter", message: "Integrate Hash Router?" },
  {
    type: "select",
    name: "deployPlatform",
    message: "Deploying on...",
    choices: ["Vercel", "Cloudflare", "None"],
  },
  { type: "confirm", name: "installDeps", message: "Install dependencies?" },
  { type: "confirm", name: "gitInit", message: "Initialize a git repository?" },
]);

const dest = path.join(process.cwd(), answers.projectName);
if (fs.existsSync(dest)) {
  console.error(`\n❌ Directory "${answers.projectName}" already exists.`);
  process.exit(1);
}

// Pick template folder
const templateDir = answers.useTailwind
  ? path.join(__dirname, "template-tailwind")
  : path.join(__dirname, "template");

// Smart copy function
function smartCopy(src, dest) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest);
    for (const file of fs.readdirSync(src)) {
      smartCopy(path.join(src, file), path.join(dest, file));
    }
  } else {
    fs.copyFileSync(src, dest);
  }
}

// Files/folders to always copy
const baseFiles = ["index.html", "main.js", "routes", "styles.css"];

// Optional files for vite
const viteFiles = ["vite.config.js", "package-with-vite.json", "package.json"];

// Optional deployment config files
const vercelFile = "vercel.json";
const wranglerFile = "wrangler.toml";

// Make destination folder
fs.mkdirSync(dest, { recursive: true });

// Copy base files
for (const f of baseFiles) {
  const srcFile = path.join(templateDir, f);
  const destFile = path.join(dest, f);
  if (fs.existsSync(srcFile)) smartCopy(srcFile, destFile);
}

// Copy Vite-related files only if vite is selected
if (answers.useVite) {
  for (const f of viteFiles) {
    const srcFile = path.join(templateDir, f);
    if (fs.existsSync(srcFile)) {
      // Copy all vite files
      smartCopy(srcFile, path.join(dest, f));
    }
  }
} else {
  // If not using vite, copy package.json only (not package-with-vite.json)
  const pkgJson = path.join(templateDir, "package.json");
  if (fs.existsSync(pkgJson)) {
    smartCopy(pkgJson, path.join(dest, "package.json"));
  }
}

// Copy deployment files selectively
const vercelSrc = path.join(templateDir, vercelFile);
const wranglerSrc = path.join(templateDir, wranglerFile);

if (answers.deployPlatform === "Vercel" && fs.existsSync(vercelSrc)) {
  smartCopy(vercelSrc, path.join(dest, vercelFile));
}

if (answers.deployPlatform === "Cloudflare" && fs.existsSync(wranglerSrc)) {
  smartCopy(wranglerSrc, path.join(dest, wranglerFile));
}

// Delete files not matching the answers

// Delete package.json or package-with-vite.json accordingly
if (answers.useVite) {
  // Rename package-with-vite.json to package.json
  const oldPath = path.join(dest, "package-with-vite.json");
  const newPath = path.join(dest, "package.json");
  if (fs.existsSync(oldPath)) {
    if (fs.existsSync(newPath)) fs.unlinkSync(newPath);
    fs.renameSync(oldPath, newPath);
  }
  // Delete plain package.json if exists
  const plainPkg = path.join(dest, "package.json");
  if (fs.existsSync(plainPkg) && plainPkg !== newPath) {
    fs.unlinkSync(plainPkg);
  }
} else {
  // Not using vite: delete package-with-vite.json
  const vitePkg = path.join(dest, "package-with-vite.json");
  if (fs.existsSync(vitePkg)) fs.unlinkSync(vitePkg);
}

// Delete deploy configs not chosen
if (answers.deployPlatform === "Vercel") {
  const cloudflareFilePath = path.join(dest, wranglerFile);
  if (fs.existsSync(cloudflareFilePath)) fs.unlinkSync(cloudflareFilePath);
} else if (answers.deployPlatform === "Cloudflare") {
  const vercelFilePath = path.join(dest, vercelFile);
  if (fs.existsSync(vercelFilePath)) fs.unlinkSync(vercelFilePath);
} else {
  // If none, delete both if present
  const vercelFilePath = path.join(dest, vercelFile);
  if (fs.existsSync(vercelFilePath)) fs.unlinkSync(vercelFilePath);
  const cloudflareFilePath = path.join(dest, wranglerFile);
  if (fs.existsSync(cloudflareFilePath)) fs.unlinkSync(cloudflareFilePath);
}

// Log info
let buildFeatures = [];
if (answers.useTailwind)
  buildFeatures.push(colors.cyan(colors.bold("TailwindCSS")));
if (answers.useRouter) buildFeatures.push(colors.bold("Hash Router"));
if (answers.useVite) buildFeatures.push(colors.magenta(colors.bold("Vite")));

log(`\n🛠️ Building with ${buildFeatures.join(", ")}`);
log(`🌐 Deploy target: ${answers.deployPlatform}\n`);

log("✅ Done!\n");

if (answers.installDeps) {
  log("🛠️Installing dependencies...");
  execSync("npm install", { cwd: dest, stdio: "inherit" });
  log("✅ Done!\n");
}

if (answers.gitInit) {
  log("🛠️ Initializing a git repository...");
  execSync("git init", { cwd: dest, stdio: "inherit" });
  log("✅ Done!\n");
}

log(`Now run "${colors.cyan(`cd ${answers.projectName} && npm run dev`)}"`);
log("Happy coding 🎉");
