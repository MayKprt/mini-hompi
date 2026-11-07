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
  const state=parseSocialState(raw);assert.equal(state.diary.length,2);assert.equal(state.visitors.length,3);assert.deepEqual(state.comments,{});
 }
});
test('sample data instances do not share mutable state',()=>{const first=initialSocialState();first.diary.pop();first.likes['slow-saturday']=true;const second=initialSocialState();assert.equal(second.diary.length,2);assert.deepEqual(second.likes,{})});
