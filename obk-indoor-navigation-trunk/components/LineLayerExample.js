import { LineLayer, ShapeSource } from "@rnmapbox/maps";

const lineLayerStyle = {
  lineColor: "#ff0000",
  lineWidth: 8,
};

const pointData = new Map([
  ["a", { p: [-87.61794, 41.86648], type: ["p"] }],
  ["b", { p: [-87.6164, 41.86648], type: ["p"] }],
  ["b2", { p: [-87.6159, 41.86648], type: ["w"] }],
  ["c", { p: [-87.6179, 41.866], type: ["p"] }],
  ["w1", { p: [-87.61705, 41.86648], type: ["w"] }],
  ["w2", { p: [-87.61705, 41.866], type: ["w"] }],
  ["d", { p: [-87.61615, 41.866], type: ["p"] }],
  ["e", { p: [-87.6159, 41.86624], type: ["p"] }],
  ["f", { p: [-87.6156, 41.86624], type: ["p"] }],
]);

const directionKey = [
  ["a", "w1", "b"],
  ["a", "w1", "w2", "c"],
  ["a", "w1", "w2", "d"],
  ["a", "w1", "b2", "e"],
  ["a", "w1", "b2", "e", "f"],
  ["b", "w1", "w2", "c"],
  ["b", "w1", "w2", "d"],
  ["b", "b2", "e"],
  ["b", "b2", "e", "f"],
  ["c", "w2", "d"],
  ["d", "w2", "w1", "b2", "e"],
];

export default LineLayerExample = () => {
  const stKey = ["d", "e"];

  const indexDirection = directionKey.findIndex((e) => {
    const st = [e[0], e[e.length - 1]];
    return (
      (st[0] == stKey[0] && st[1] == stKey[1]) ||
      (st[1] == stKey[0] && st[0] == stKey[1])
    );
  });

  let mapDirectionPoint = null;

  try {
    mapDirectionPoint = directionKey[indexDirection].map((e) => {
      return pointData.get(e).p;
    });
  } catch (e) {
    console.log("error: ", e);
  }

  const features = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        id: "a-feature",
        geometry: {
          type: "LineString",
          coordinates: mapDirectionPoint,
        },
        properties: {},
      },
    ],
  };

  return (
    mapDirectionPoint && (
      <ShapeSource id={"shape-source-id-0"} shape={features}>
        <LineLayer id={"line-layer"} style={lineLayerStyle} />
      </ShapeSource>
    )
  );
};
