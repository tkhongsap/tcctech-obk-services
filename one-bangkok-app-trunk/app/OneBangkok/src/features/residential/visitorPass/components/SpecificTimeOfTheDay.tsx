import dayjs, {Dayjs} from 'dayjs';
import React, {useState} from 'react';
import {View} from 'react-native';
import DateTime from '~/utils/datetime';
import t from '~/utils/text';
import ListItemDescription from './ListItemDescription';
import {Spacing, Text} from '~/components/atoms';
import {TimePicker} from '~/components/organisms/TimePicker';
import {DatePickerThemeEnum} from '~/components/molecules/TimePickerField';

type props = {
  isSpecific: boolean;
  onIsSpecificChange: (value: boolean) => void;
  specificStart: string;
  setSpecificStart: (value: string) => void;
  specificEnd: string;
  setSpecificEnd: (value: string) => void;
  methods: any;
  disabled: boolean;
};
const SpecificTimeOfTheDay = React.memo(
  ({
    specificStart,
    setSpecificStart,
    specificEnd,
    setSpecificEnd,
    methods,
  }: props) => {
    const validateUntilDate = (value: string | any[]) => {
      try {
        const hourEndDigit = Number(value.slice(0, 2));
        const minuteEndDigit = Number(value.slice(3));
        const hourStartDigit = Number(
          methods.getValues('specificStart').slice(0, 2),
        );
        const minuteStartDigit = Number(
          methods.getValues('specificStart').slice(3),
        );

        if (!value) {
          return;
        }
        if (hourEndDigit > 23 || minuteEndDigit > 59 || value.length < 4) {
          return t(
            'Residential__Please_input_24_format',
            'Please, input in 24 hours time format',
          );
        }
        const isStartHrGreaterThanEndHr = hourStartDigit > hourEndDigit;

        const totalStart = hourStartDigit + minuteStartDigit;
        const totalEnd = hourEndDigit + minuteEndDigit;
        if (
          isStartHrGreaterThanEndHr ||
          (hourStartDigit === hourEndDigit && totalStart >= totalEnd)
        ) {
          return t(
            'Residential__Input_24_format',
            'input in 24 hours time format',
          );
        }
      } catch (error) {}
    };

    const formatValue = (value: string) => {
      return dayjs(
        `${DateTime.getCurrentDateTime().format('YYYY-MM-DD')} ${value}`,
        'YYYY-MM-DD HH:mm',
      );
    };

    const [startTime, setStartTime] = useState<Dayjs>(
      formatValue(specificStart),
    );
    const [endTime, setEndTime] = useState<Dayjs>(formatValue(specificEnd));

    return (
      <View className="flex flex-col">
        <Text className="font-semibold">
          {t(
            'Residential__Visitor_management__Visitor_create_2__Specific_time_header',
            'Access Time',
          )}
        </Text>
        <Text className="text-muted-light text-sm">
          {t(
            'Residential__Visitor_management__Visitor_create_2__Specific_time_body',
            'A Guest Pass can be granted for a maximum duration of 4 hours. For any requests exceeding this limit, please contact the Concierge.',
          )}
        </Text>
        <Spacing height={16} />
        <>
          <Spacing height={10} />
          <View className="flex flex-row gap-[16px]">
            <View className="flex-1">
              <TimePicker
                themeColor={DatePickerThemeEnum.forest}
                defaultValue={specificStart}
                labelText={t('Residential__Start', 'Start')}
                onFocus={() => methods.clearErrors('start')}
                maxTime={endTime}
                onTimeChange={(value: string) => {
                  setStartTime(formatValue(value));
                  setSpecificStart(value);
                }}
                name="specificTimeStart"
                rules={{
                  validate: value => {
                    if (!value) {
                      return;
                    }
                    if (
                      value.length < 4 ||
                      Number(value.slice(0, 2)) > 23 ||
                      Number(value.slice(3)) > 59
                    ) {
                      return t(
                        'Residential__Please_input_24_format',
                        'Please input in 24 hours time format',
                      );
                    }
                  },
                }}
              />
            </View>
            <View className="flex-1">
              <TimePicker
                onFocus={() => methods.clearErrors('end')}
                themeColor={DatePickerThemeEnum.forest}
                labelText={t('Residential__End', 'End')}
                name="specificTimeEnd"
                defaultValue={specificEnd}
                onTimeChange={(value: string) => {
                  setEndTime(formatValue(value));
                  setSpecificEnd(value);
                }}
                rules={{
                  validate: value => validateUntilDate(value),
                }}
              />
            </View>
          </View>
        </>
      </View>
    );
  },
);

export default SpecificTimeOfTheDay;
