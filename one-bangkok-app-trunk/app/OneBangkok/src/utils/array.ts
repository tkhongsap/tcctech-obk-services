export function removeDuplicatedItemsFromArray(
  array: any[],
  propertyName: string,
) {
  const result = array.reduce((acc, cv) => {
    if (acc.hasOwnProperty(cv[propertyName])) {
      if (cv.val < acc[cv[propertyName]].val) {
        acc[cv[propertyName]] = cv;
      }
    } else {
      acc[cv[propertyName]] = cv;
    }
    return acc;
  }, {});
  return Object.values(result);
}
