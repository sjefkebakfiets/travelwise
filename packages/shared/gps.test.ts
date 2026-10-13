import test from 'node:test';
import assert from 'node:assert/strict';
import {validatePoint,distanceMeters,routeSegments} from './gps.ts';
const point = {id:'11111111-1111-4111-8111-111111111111',segmentId:'22222222-2222-4222-8222-222222222222',latitude:52,longitude:5,timestamp:'2026-10-12T12:00:00Z',accuracy:5};
test('valid point preserves original coordinates',()=>assert.deepEqual(validatePoint(point),point));
test('reject invalid coordinates, numbers and UTC timestamps',()=>{for(const patch of [{latitude:91},{longitude:-181},{accuracy:-1},{latitude:NaN},{timestamp:'2026-10-12T12:00:00+02:00'},{id:'x'}]) assert.throws(()=>validatePoint({...point,...patch}));});
test('distance uses geodesic measurement',()=>{assert.equal(distanceMeters(point,point),0);assert.ok(Math.abs(distanceMeters({...point,latitude:0,longitude:0},{...point,latitude:0,longitude:1})-111195)<2);});
test('duplicates never increase route point count',()=>assert.equal(routeSegments([point,point])[0].length,1));
test('gaps and pause identifiers break routes',()=>{const next={...point,id:'33333333-3333-4333-8333-333333333333',timestamp:'2026-10-12T12:20:00Z'};assert.equal(routeSegments([point,next]).length,2);assert.equal(routeSegments([point,{...next,timestamp:'2026-10-12T12:00:10Z',segmentId:next.id}]).length,2);});
test('poor accuracy and impossible jumps cannot connect tracks',()=>{const next={...point,id:'33333333-3333-4333-8333-333333333333',longitude:10,timestamp:'2026-10-12T12:00:01Z'};assert.equal(routeSegments([point,next]).length,2);assert.equal(routeSegments([{...point,accuracy:500}]).length,0);});

test('invalid calendar dates are rejected',()=>assert.throws(()=>validatePoint({...point,timestamp:'2026-02-30T12:00:00Z'})));
test('visualization leaves raw data intact',()=>{const raw=[{...point,accuracy:500},point];const original=structuredClone(raw);routeSegments(raw);assert.deepEqual(raw,original);});
