import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {isPortfolioMode,translator,english} from '../src/locale.ts';
import {defaults} from '../src/engine.ts';

test('English is activated only by the portfolio mode query parameter',()=>{
 for(const query of ['?mode=portfolio','?source=readdy&mode=portfolio','?mode=portfolio&theme=light'])assert.equal(isPortfolioMode(query),true);
 for(const query of ['', '?lang=en','?mode=launch','?mode=Portfolio','?portfolio=true'])assert.equal(isPortfolioMode(query),false);
});
test('Korean defaults are retained verbatim, including surrounding whitespace',()=>{
 const ko=translator(false),en=translator(true);
 assert.equal(ko('안녕! 내 방에 놀러 와 줘서 고마워 ♡'),'안녕! 내 방에 놀러 와 줘서 고마워 ♡');
 assert.equal(en('안녕! 내 방에 놀러 와 줘서 고마워 ♡'),'Hi! Thanks for stopping by my little room ♡');
 assert.equal(ko(' 포근함'),' 포근함');assert.equal(en(' 포근함'),' Cozy');
});
test('all room messages, interface text, and furniture labels have English copy',()=>{
 const source=readFileSync(new URL('../src/App.tsx',import.meta.url),'utf8');
 const keys=[...source.matchAll(/\bt\('([^']+)'\)/g)].map(m=>m[1]);
 keys.push(...defaults.map(f=>f.label));
 assert.ok(keys.length>50);
 for(const key of keys){assert.ok(english[key.trim()],`Missing English copy: ${key}`);assert.doesNotMatch(translator(true)(key),/[가-힣]/);assert.equal(translator(false)(key),key)}
});
