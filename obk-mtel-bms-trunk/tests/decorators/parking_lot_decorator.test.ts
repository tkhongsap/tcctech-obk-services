import { resetDB } from '../helpers/db';
import { createParkingLot } from '../fixtures/parking_lot';
import { DecoratedPartialParkingLot, ParkingLotDecorator } from '../../src/decorators/parking_lot_decorator';

let parkingLot1: any;
let parkingLot2: any;

beforeEach(async () => {
  await resetDB();

  parkingLot1 = await createParkingLot('test2', '2', '2', '2');
  parkingLot2 = await createParkingLot('test3', '3', '3', '3');
});

describe('ParkingLotDecorator', () => {
  describe('decorate()', () => {
    describe('singular', () => {
      describe('with option withTotalAvailableSpots', () => {
        it('return correct totalAvailableSpots', async () => {
          const decorator = new ParkingLotDecorator(parkingLot1, {
            withTotalAvailableSpots: true,
          });

          const decoratedParkingLot = decorator.decorate() as DecoratedPartialParkingLot;

          console.dir({ decoratedParkingLot });
          expect(decoratedParkingLot.total_available_spots).toEqual(15);
        });
      });
    });
    describe('multiple', () => {
      describe('with option withTotalAvailableSpots', () => {
        it('returns correct totalAvailableSpots for each parking lot', async () => {
          const decorator = new ParkingLotDecorator([parkingLot1, parkingLot2], {
            withTotalAvailableSpots: true,
          });

          const decoratedParkingLots = decorator.decorate() as DecoratedPartialParkingLot[];

          console.dir({ decoratedParkingLots });
          expect(decoratedParkingLots.length).toEqual(2);
          expect(decoratedParkingLots[0].total_available_spots).toEqual(15);
          expect(decoratedParkingLots[1].total_available_spots).toEqual(15);
        });
      });
    });
  });
});