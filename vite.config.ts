import { build, defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';
import { readFile, writeFile } from 'node:fs/promises';

const figmaArtifacts = () => ({
  name: 'figma-artifacts',
  apply: 'build' as const,
  async closeBundle() {
    await build({configFile:false,build:{outDir:'dist',emptyOutDir:false,lib:{entry:resolve('src/plugin/controller.ts'),name:'DesignQA',formats:['iife'],fileName:()=> 'code.js'}}});
    const sourceHtml = resolve('dist/src/ui/ui.html');
    const outputHtml = resolve('dist/ui.html');
    let html = await readFile(sourceHtml, 'utf8');
    const scriptMatch = html.match(/<script[^>]+src="([^"]+)"[^>]*><\/script>/);
    const styleMatch = html.match(/<link[^>]+href="([^"]+\.css)"[^>]*>/);
    if (!scriptMatch?.[1] || !styleMatch?.[1]) {
      throw new Error('Could not locate generated UI assets for Figma inlining.');
    }
    const script = (await readFile(resolve('dist', scriptMatch[1].replace(/^\//, '')), 'utf8'))
      .replaceAll('</script', String.raw`<\/script`);
    const style = await readFile(resolve('dist', styleMatch[1].replace(/^\//, '')), 'utf8');
    // Function replacements prevent minified `$&`, `$\``, and `$'` sequences from
    // being interpreted as String.replace substitution tokens and corrupting HTML.
    html = html.replace(scriptMatch[0], '');
    html = html.replace(styleMatch[0], () => `<style>${style}</style>`);
    html = html.replace('</body>', () => `<script>${script}</script></body>`);
    const inlineScript = html.slice(html.indexOf('<script>') + 8, html.lastIndexOf('</script>'));
    if (/<\/script/i.test(inlineScript)) {
      throw new Error('Unsafe closing script sequence remains in generated Figma UI.');
    }
    if (html.indexOf('id="root"') > html.indexOf('<script>')) {
      throw new Error('Generated UI script must execute after the React root element exists.');
    }
    await writeFile(outputHtml, html);
    const manifest = JSON.parse(await readFile(resolve('manifest.json'), 'utf8')) as Record<string, unknown>;
    manifest.main = 'code.js';
    manifest.ui = 'ui.html';
    await writeFile(resolve('dist/manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
  },
});

export default defineConfig({
  plugins: [react(), figmaArtifacts()],
  build: {
    emptyOutDir: true,
    rollupOptions: {
      input: { ui: resolve(__dirname, 'src/ui/ui.html') },
      output: { entryFileNames: (chunk) => chunk.name === 'code' ? 'code.js' : 'assets/[name].js', assetFileNames: 'assets/[name][extname]' },
    },
  },
});
