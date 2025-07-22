import { ImmutableObject } from "@hookstate/core";
import { get } from "lodash";
import { FloorData } from "ob-bms-sdk/dist/api";
import { ListSelect } from "~/components/molecules/SelectList";

export const sortedZone = (zone: string[]) => {
  const sortedZones = zone.sort((a, b) => {
    const aIsNumber = !isNaN(parseInt(a));
    const bIsNumber = !isNaN(parseInt(b));

    if (aIsNumber && bIsNumber) {
      return parseInt(a) - parseInt(b);
    } else if (!aIsNumber && !bIsNumber) {
      return a.localeCompare(b);
    } else {
      return aIsNumber ? 1 : -1;
    }
  });
  return sortedZones;
};
export const sortedFloor = (floors: ImmutableObject<FloorData>[],currentLanguage: string) => {
  const sortFloors = floors.sort((a, b) => {
    const aDisplayName = get(a, ['display_name', currentLanguage], a.name);
    const bDisplayName = get(b, ['display_name', currentLanguage], b.name);

    const aPrefix = aDisplayName.match(/\D+/)?.[0] || '';
    const bPrefix = bDisplayName.match(/\D+/)?.[0] || '';

    const aSuffix = aDisplayName.match(/\d+/)?.[0] || '';
    const bSuffix = bDisplayName.match(/\d+/)?.[0] || '';

    if (aPrefix === bPrefix) {
      return parseInt(aSuffix) - parseInt(bSuffix);
    } else {
      return aPrefix.localeCompare(bPrefix);
    }
  });
  return sortFloors
};

export const sortedIssue = (issueType: ListSelect[]) => {
    const sortIssue = issueType.sort((a, b) => {
        const nameA = a.name.toLowerCase();
        const nameB = b.name.toLowerCase();
        
        if (nameA < nameB) return -1;
        if (nameA > nameB) return 1;
        return 0;
    });
  return sortIssue
}
