import {test} from 'node:test';
import assert from 'node:assert/strict';
import {defaults,project,unproject,pathfind,blocked,placement} from '../src/engine.ts';
test('projection round trips room corners and arbitrary points',()=>{for(const p of [{x:0,y:0},{x:10,y:10},{x:2.3,y:7.8}]){const s=project(p),r=unproject(s.x,s.y);assert.ok(Math.abs(p.x-r.x)<1e-8&&Math.abs(p.y-r.y)<1e-8)}});
test('routes go around furniture without diagonal corner cutting',()=>{const start={x:2,y:5},target={x:2,y:1};const path=pathfind(start,target,defaults);assert.ok(path.length>0);let prev=start;for(const p of path){assert.equal(blocked(p,defaults),false);const dx=p.x-prev.x,dy=p.y-prev.y;if(dx&&dy){assert.equal(blocked({x:prev.x+dx,y:prev.y},defaults),false);assert.equal(blocked({x:prev.x,y:prev.y+dy},defaults),false)}prev=p}assert.deepEqual(path.at(-1),target)});
test('floor boundary and occupied targets reject movement',()=>{assert.deepEqual(pathfind({x:5,y:8},{x:12,y:2},defaults),[]);assert.deepEqual(pathfind({x:5,y:8},defaults[0],defaults),[])});
test('furniture cannot overlap or leave floor',()=>{assert.ok(defaults.every(f=>placement(f,defaults)));assert.equal(placement({...defaults[0],x:-1},defaults),false);assert.equal(placement({...defaults[0],x:defaults[1].x,y:defaults[1].y},defaults),false)});
