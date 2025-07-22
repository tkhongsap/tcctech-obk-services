import { Body, Get, OperationId, Post, Query, Route } from 'tsoa';
import { holidaysSerializer } from './holidays_controller.serializer';
import { HolidayRequestBody, HolidayResponse, UpsertHolidayResponse } from './holidays_controller.interfaces';
import { BaseController } from './base_controller';
import { WrappedArrayResponse, WrappedResponse } from './base_controller.interfaces';
import HolidayService from '../services/holiday_service';
import { isEmpty } from 'lodash';
import { CustomError } from '../middlewares/error';
import { OBError } from '../utils/error_spec';

@Route('holidays')
export class HolidaysController extends BaseController {
  @Get('')
  @OperationId('holidays.getHolidayWithMinDate')
  public async getHolidayWithMinDate(@Query() date?: string): Promise<WrappedArrayResponse<HolidayResponse>> {
    if (date) {
      const parsedDate = Date.parse(date);
      if (isNaN(parsedDate)) {
        throw new CustomError(OBError.BMS_HOLIDAY_002);
      }
    }
    const holidayService = new HolidayService();
    const holidays = await holidayService.getHolidayWithMinDate(date);

    const data = holidaysSerializer(holidays);
    this.setStatus(200);
    return { data: data };
  }
  @Post('')
  @OperationId('holidays.create')
  public async create(@Body() body: HolidayRequestBody[]): Promise<WrappedResponse<UpsertHolidayResponse>> {
    if (isEmpty(body)) {
      throw new CustomError(OBError.BMS_HOLIDAY_001);
    }
    const holidayService = new HolidayService();
    const result = await holidayService.upsertHolidays(body);

    if (!isEmpty(result)) {
      this.setStatus(500);
      return {
        data: {
          result: result,
        },
      };
    }

    this.setStatus(200);
    return {
      data: {
        result: true,
      },
    };
  }
}
