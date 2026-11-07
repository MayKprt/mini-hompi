import {test} from 'node:test';
import assert from 'node:assert/strict';
import {initialSocialState,parseSocialState} from '../src/socialStore.ts';

test('diary, comments, reactions and guestbook survive storage round trip',()=>{
 const state=initialSocialState();const date='2026-11-07T14:00:00-05:00';
 state.diary.unshift({id:'new-page',title:'Today',body:'A little joy.',mood:'grateful',date});
 state.comments['new-page']=[{id:'note',name:'You',body:'Lovely!',date}];state.likes['new-page']=true;
 state.visitors.unshift({id:'hello',name:'Robin',body:'Hello there!',date});
 assert.deepEqual(parseSocialState(JSON.stringify(state)),state);
});
test('malformed saved content falls back to safe sample content',()=>{
 for(const raw of [null,'not json','{}',JSON.stringify({...initialSocialState(),comments:{one:[{body:'incomplete'}]}}),JSON.stringify({...initialSocialState(),diary:[{id:'bad',date:'not-a-date',title:'Bad',body:'Bad',mood:'cozy'}]})]){
  const state=parseSocialState(raw);assert.equal(state.diary.length,2);assert.equal(state.visitors.length,4);assert.deepEqual(state.comments,{});
 }
});
test('sample data instances do not share mutable state',()=>{const first=initialSocialState();first.diary.pop();first.likes['slow-saturday']=true;const second=initialSocialState();assert.equal(second.diary.length,2);assert.deepEqual(second.likes,{})});

test('Robin is available without browser storage',()=>{
 const state=parseSocialState(null);assert.equal(state.visitors[0].name,'Robin');assert.equal(state.visitors[0].body,'A little hello from a cozy corner of the internet.');
});
test('older saved visitors gain Robin while preserving personal data',()=>{
 const state=initialSocialState();state.visitors=state.visitors.filter(note=>note.id!=='robin');state.likes['slow-saturday']=true;state.visitors.unshift({id:'personal',name:'You',body:'Keep me',date:'2026-11-07T18:00:00Z'});
 const restored=parseSocialState(JSON.stringify(state));assert.deepEqual(restored.visitors.slice(1),state.visitors);assert.deepEqual(restored.likes,state.likes);assert.equal(restored.visitors[0].id,'robin');assert.deepEqual(parseSocialState(JSON.stringify(restored)),restored);
});
test('the previously saved local Robin is not duplicated',()=>{
 const state=initialSocialState();state.visitors[0].id='old-local-robin';assert.deepEqual(parseSocialState(JSON.stringify(state)),state);
});
