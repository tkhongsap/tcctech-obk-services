import React from 'react';
import {RepetitionType} from '../store';
import t from '~/utils/text';
import {View} from 'react-native';
import ListItemDescription from './ListItemDescription';
import {Spacing} from '~/components/atoms';
import {SelectRepeatList} from './SelectRepeatList';
import dayjs from 'dayjs';
import SelectSpecificDay, {DaySelect} from './SelectSpecificDay';
import {DatePicker} from './DatePicker';
import DateTime from '~/utils/datetime';

const MAX_DAYS_IN_ADVANCE = 60;

type Props = {
  date?: string;
  isRepeat: boolean;
  onIsRepeatChange: (isRepeat: boolean) => void;
  repeatType: string | undefined;
  onRepeatTypeChange: (repeatType: string) => void;
  specificDays: DaySelect[];
  setSpecificDays: (days: DaySelect[]) => void;
  disabled: boolean;
  methods: any;
  repeatUtilDate: string | undefined;
  setRepeatUtilDate: (value: string) => void;
  requiredSpecificDayError?: boolean;
};

const RepeatVisitorPass = React.memo(
  ({
    date,
    isRepeat,
    onIsRepeatChange,
    repeatType,
    onRepeatTypeChange,
    specificDays,
    setSpecificDays,
    disabled,
    methods,
    repeatUtilDate,
    setRepeatUtilDate,
    requiredSpecificDayError = false,
  }: Props) => {
    const onValueChange = (value: boolean) => {
      onIsRepeatChange(value);
      methods.clearErrors('repeatType');
      methods.clearErrors('repeatUntil');
    };

    return (
      <View>
        <ListItemDescription
          text={t('Residential__Repeat', 'Repeat')}
          description={t(
            'Residential__Visitor_management__Visitor_create_2__Repeat_body',
            'Select if visitors should have access to the building  for more than one day',
          )}
          value={isRepeat}
          onValueChange={onValueChange}
          disabled={disabled}
        />
        <Spacing height={24} />
        <SelectRepeatList
          onSelect={onRepeatTypeChange}
          rules={{
            required: isRepeat
              ? t(
                  'Residential__Please_select_repeat_date',
                  'Please Select Repeat Date',
                )
              : '',
          }}
          disabled={!isRepeat}
          data={[
            {
              value: RepetitionType.EVERYDAY.toString(),
              name: t(
                'Residential__Visitor_management__Visitor_create_2__Everyday',
                'EveryDay',
              ),
            },
            {
              value: RepetitionType.EVERY_SPECIFIC_DATE.toString(),
              name: date
                ? t(
                    'Residential__Visitor_management__Visitor_create_2__Every_date',
                    'Every {{day}} of the month',
                  ).replace('{{day}}', dayjs(date).get('date').toString())
                : t(
                    'Residential__Visitor_management__Visitor_create_2__Every_date_pre',
                    'Every ... of the month',
                  ),
            },
            {
              value: RepetitionType.EVERY_SPECIFIC_DAY.toString(),
              name: t(
                'Residential__Visitor_management__Visitor_create_2__Every_Specific_day',
                'Every Specific day',
              ),
            },
          ]}
          defaultValue={repeatType}
          name="repeatType"
        />
        <Spacing height={24} />
        <SelectSpecificDay
          specificDays={specificDays}
          setSpecificDays={setSpecificDays}
          disabled={
            !isRepeat ||
            repeatType === undefined ||
            parseInt(repeatType) !== RepetitionType.EVERY_SPECIFIC_DAY
          }
          hasError={requiredSpecificDayError}
        />
        <Spacing height={24} />
        <DatePicker
          disabled={!isRepeat}
          minDate={dayjs(date).toDate()}
          maxDate={dayjs().add(MAX_DAYS_IN_ADVANCE, 'days').toDate()}
          labelText={t('Residential__Until', 'Until')}
          placeholder={t('Residential__Until', 'Until')}
          defaultValue={repeatUtilDate}
          onDateChange={setRepeatUtilDate}
          name="repeatUntil"
          onFocus={() => methods.clearErrors('repeatUntil')}
          rules={{
            required: isRepeat
              ? t(
                  'Residential__Please_select_until_date',
                  'Please Select Until Date',
                )
              : '',
            validate: _value => {
              if (isRepeat) {
                // limit 90 days
                if (
                  dayjs(_value).diff(DateTime.getCurrentDateTime(), 'day') > 90
                ) {
                  return t(
                    'Residential__Limit_90_days',
                    'Limit date is 90 days',
                  );
                }
                if (dayjs(_value).isBefore(methods.getValues('date'))) {
                  return t(
                    'Residential__Until_date_grater_end_date',
                    'Until date must be greater than date',
                  );
                }
              }
            },
          }}
        />
      </View>
    );
  },
);

export default RepeatVisitorPass;
