import { spawn } from 'node:child_process';
import { readdirSync, statSync } from 'node:fs';
import { resolve } from 'node:path';

const vite = resolve('node_modules/vite/bin/vite.js');
let building = false;
let queued = false;
let timer;

function build() {
  if (building) {
    queued = true;
    return;
  }
  building = true;
  console.log(`\n[Design QA Copilot] Building at ${new Date().toLocaleTimeString()}…`);
  const child = spawn(process.execPath, [vite, 'build'], { stdio: 'inherit' });
  child.on('exit', (code) => {
    building = false;
    if (code === 0) console.log('[Design QA Copilot] Build ready. Reopen the plugin in Figma.');
    else console.error(`[Design QA Copilot] Build failed with exit code ${code}.`);
    if (queued) {
      queued = false;
      build();
    }
  });
}

function schedule() {
  clearTimeout(timer);
  timer = setTimeout(build, 120);
}

function snapshot() {
  const files = [];
  const visit = (path) => {
    for (const entry of readdirSync(path, { withFileTypes: true })) {
      const target = resolve(path, entry.name);
      if (entry.isDirectory()) visit(target);
      else files.push(target);
    }
  };
  visit(resolve('src'));
  files.push(resolve('manifest.json'), resolve('vite.config.ts'));
  return files.sort().map((file) => {
    const stat = statSync(file);
    return `${file}:${stat.mtimeMs}:${stat.size}`;
  }).join('|');
}

let previous = snapshot();
setInterval(() => {
  const current = snapshot();
  if (current !== previous) {
    previous = current;
    schedule();
  }
}, 750);
console.log('[Design QA Copilot] Watching src/, manifest.json, and vite.config.ts. Press Ctrl+C to stop.');
build();
