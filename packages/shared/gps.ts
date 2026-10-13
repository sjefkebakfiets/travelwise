export type GPSPoint = { id: string; latitude: number; longitude: number; timestamp: string; accuracy: number; segmentId: string };
export function validatePoint(value: unknown): GPSPoint {
  if (!value || typeof value !== 'object') throw new Error('Invalid point');
  const p = value as Record<string, unknown>;
  for (const key of ['id', 'segmentId']) if (typeof p[key] !== 'string' || !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(p[key] as string)) throw new Error('Invalid identifier');
  for (const key of ['latitude', 'longitude', 'accuracy']) if (typeof p[key] !== 'number' || !Number.isFinite(p[key])) throw new Error('Invalid number');
  if (Math.abs(p.latitude as number) > 90 || Math.abs(p.longitude as number) > 180 || (p.accuracy as number) < 0) throw new Error('Invalid coordinate or accuracy');
  if (typeof p.timestamp !== 'string' || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?Z$/.test(p.timestamp) || !Number.isFinite(Date.parse(p.timestamp))) throw new Error('UTC timestamp required');
  if (new Date(p.timestamp as string).toISOString().slice(0,19) !== (p.timestamp as string).slice(0,19)) throw new Error('Invalid calendar date');
  return {id:p.id as string, segmentId:p.segmentId as string, latitude:p.latitude as number, longitude:p.longitude as number, accuracy:p.accuracy as number, timestamp:p.timestamp};
}
export function distanceMeters(a: GPSPoint, b: GPSPoint): number {
  const rad = (n: number) => n * Math.PI / 180;
  const dLat = rad(b.latitude-a.latitude), dLon = rad(b.longitude-a.longitude);
  const h = Math.sin(dLat/2)**2 + Math.cos(rad(a.latitude))*Math.cos(rad(b.latitude))*Math.sin(dLon/2)**2;
  return 6371008.8 * 2 * Math.asin(Math.sqrt(Math.min(1,h)));
}
export function routeSegments(points: readonly GPSPoint[], maxAccuracy = 100, maxSpeed = 100, gapSeconds = 600): GPSPoint[][] {
  const seen = new Set<string>(); const segments: GPSPoint[][] = []; let current: GPSPoint[] = [];
  for (const raw of [...points].sort((a,b)=>Date.parse(a.timestamp)-Date.parse(b.timestamp))) {
    const p = validatePoint(raw);
    if (seen.has(p.id)) continue; seen.add(p.id);
    if (p.accuracy > maxAccuracy) { current = []; continue; }
    const previous = current.at(-1);
    if (previous) {
      const seconds = (Date.parse(p.timestamp)-Date.parse(previous.timestamp))/1000;
      if (seconds <= 0 || distanceMeters(previous,p)/seconds > maxSpeed || seconds > gapSeconds || previous.segmentId !== p.segmentId) current = [];
    }
    if (!current.length) { current = []; segments.push(current); }
    current.push(p);
  }
  return segments;
}
