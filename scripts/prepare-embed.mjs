import { cpSync, existsSync, mkdirSync, readFileSync, writeFileSync, symlinkSync, rmSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const target=path.join(root,'portfolio-embed');
mkdirSync(target,{recursive:true});
for(const dir of ['src','public/assets','tests'])cpSync(path.join(root,dir),path.join(target,dir),{recursive:true,filter:source=>!source.endsWith('/source-atlas.png')});
rmSync(path.join(target,'public/assets/source-atlas.png'),{force:true});
// A public embed needs only the six sprites and their motion frames, not the large source atlas.
// Copying public is intentional: sprites keep exactly the same asset URLs in both views.
writeFileSync(path.join(target,'index.html'),readFileSync(path.join(root,'embed/index.html')));
for(const f of ['tsconfig.json','pnpm-lock.yaml'])cpSync(path.join(root,f),path.join(target,f));
const pkg=JSON.parse(readFileSync(path.join(root,'package.json'),'utf8'));
pkg.name='miniroom-portfolio-embed';
pkg.scripts={dev:'vite',build:'vite build',typecheck:'tsc --noEmit',test:'node --experimental-strip-types --test tests/engine.test.mjs tests/locale.test.mjs'};
writeFileSync(path.join(target,'package.json'),JSON.stringify(pkg,null,2)+'\n');
writeFileSync(path.join(target,'vite.config.mjs'),`import {defineConfig} from 'vite';\nimport react from '@vitejs/plugin-react';\nexport default defineConfig({plugins:[react()],server:{host:'0.0.0.0'},build:{outDir:'dist'}});\n`);
writeFileSync(path.join(target,'.gitignore'),'node_modules/\ndist/\n.DS_Store\n');
mkdirSync(path.join(target,'.openai'),{recursive:true});
const manifest=path.join(target,'.openai/hosting.json');
const hosting=existsSync(manifest)?JSON.parse(readFileSync(manifest,'utf8')):{};
hosting.static={directory:'dist'};
writeFileSync(manifest,JSON.stringify(hosting,null,2)+'\n');
writeFileSync(path.join(target,'README.md'),'# Portfolio Miniroom Embed\n\nStandalone room-only React + TypeScript build. Korean by default; add `?mode=portfolio` for English. Run `pnpm install`, `pnpm dev`, or `pnpm build`. Deploy the contents of dist to any static host. Keep framing enabled. See ../EMBED.md in the parent source project for integration instructions.\n');
if(!existsSync(path.join(target,'node_modules'))&&existsSync(path.join(root,'node_modules')))symlinkSync(path.join(root,'node_modules'),path.join(target,'node_modules'),'dir');
console.log('Prepared standalone source: '+target);
