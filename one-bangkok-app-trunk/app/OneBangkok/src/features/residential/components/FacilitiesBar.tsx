import {View} from 'react-native';
import React from 'react';

type ZoneName = 'Night' | 'Comfort' | 'Eco';
export type SDReadableTimetableObject = {
  timeReadable: string;
  zoneId: number;
  zoneName: ZoneName;
  mOffset: number;
  dateStart: string;
  dateEnd: string;
  timeStart: string;
  timeEnd: string;
};
type ReadableTimetablePercent = SDReadableTimetableObject & {
  percent: number;
};
type Props = {
  timetables: SDReadableTimetableObject[];
};
const dayMinutes = 24 * 60;

const FacilitiesBar = ({timetables}: Props) => {
  const timetablesLength = timetables.length;

  const deltaOfMOffset = (curr: number, next: number) => next - curr;

  const percentageOf = (deltaMOffset: number) => {
    return (deltaMOffset / dayMinutes) * 100;
  };

  const timetablesPercentages: ReadableTimetablePercent[] = timetables.map(
    (time, index) => {
      const nextIndex = index + 1;
      let deltaMOffset = time.mOffset;
      if (nextIndex < timetablesLength) {
        deltaMOffset = deltaOfMOffset(
          deltaMOffset,
          timetables[nextIndex].mOffset,
        );
      } else {
        // latest mOffset
        deltaMOffset = dayMinutes;
      }

      const percent = percentageOf(deltaMOffset);
      return {...time, percent};
    },
  );

  const getColorByZone = (zone: ZoneName) => {
    switch (zone) {
      case 'Night':
        return '#FFAD7D';
      case 'Comfort':
        return '#B0F0D5';
      case 'Eco':
        return '#FF6865';
      default:
        return '#FFAD7D';
    }
  };

  return (
    <View className="w-full h-[9px] rounded-full flex flex-row items-center overflow-hidden">
      {timetablesPercentages.map(({percent, zoneName}, index) => (
        <View
          key={`${zoneName}_${index}`}
          style={{
            width: `${percent}%`,
            backgroundColor: getColorByZone(zoneName),
          }}
          className="h-full"
        />
      ))}
    </View>
  );
};

export default FacilitiesBar;
