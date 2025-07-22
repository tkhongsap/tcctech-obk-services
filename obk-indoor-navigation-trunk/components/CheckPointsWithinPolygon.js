import * as turf from "@turf/turf";

export default async function (point, polygon) {
  const points = turf.points([point]);
  const searchWithin = turf.polygon(polygon);
  return await turf.pointsWithinPolygon(points, searchWithin);
}

