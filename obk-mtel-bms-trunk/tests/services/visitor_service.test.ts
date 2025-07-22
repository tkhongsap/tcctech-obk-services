import { resetDB } from '../helpers/db';
import { VisitorService } from '../../src/services';
import { VisitorSchedule } from '../../src/controllers/visitors_controller.interfaces';

const visitorService = new VisitorService();

beforeEach(async () => {
  await resetDB();
  jest.restoreAllMocks;
});

describe('VisitorService', () => {
  describe('computeVisitScheduleTo', () => {
    describe('when until exists', () => {
      it('return to', () => {
        const schedule: VisitorSchedule = {
          tower_id: 'string',
          floor_id: 'string',
          from: '2024-02-05T00:00:00.000Z',
          to: '2024-02-05T10:30:00.000Z',
        };
        const date = visitorService.computeVisitScheduleTo(schedule);
        expect(date).toEqual(new Date('2024-02-05T10:30:00.000Z'));
      });
      it('return until', () => {
        const schedule: VisitorSchedule = {
          tower_id: 'string',
          floor_id: 'string',
          from: '2024-02-05T00:00:00.000Z',
          to: '2024-02-05T10:30:00.000Z',
          repetition: {
            until: '2024-02-07T00:00:00.000Z',
          },
        };
        const date = visitorService.computeVisitScheduleTo(schedule);
        expect(date).toEqual(new Date('2024-02-07T10:30:00.000Z'));
      });
    });
  });
});
