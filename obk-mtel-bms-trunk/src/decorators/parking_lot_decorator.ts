import { map } from 'lodash';
import { Prisma } from '../../db/client';

export interface DecoratedPartialParkingLot
  extends Partial<
    Prisma.ParkingFloorGetPayload<{
      include: {
        parking_lots: {
          include: {
            spot_types: true;
          };
        };
      };
    }>
  > {
  total_available_spots?: number;
}

export interface DecoratedPartileSpotType
  extends Partial<
    Prisma.ParkingLotGetPayload<{
      include: { spot_types: true };
    }>
  > {}

export type ParkingLotDecoratorInput = DecoratedPartialParkingLot | DecoratedPartialParkingLot[];

export interface ParkingLotDecoratorOptions {
  withTotalAvailableSpots: boolean;
}

export class ParkingLotDecorator {
  private isMultiple: boolean;
  private input: ParkingLotDecoratorInput;
  private options: ParkingLotDecoratorOptions;

  constructor(input: ParkingLotDecoratorInput, options: ParkingLotDecoratorOptions) {
    this.isMultiple = Array.isArray(input);
    this.input = input;
    this.options = options;
  }

  private calculateTotalAvailableSpotsParkingFloor(parkingLot: DecoratedPartialParkingLot): number {
    return (
      parkingLot.parking_lots?.reduce(
        (total, spotType) =>
          total + (spotType.spot_types.reduce((total, type) => total + type.available_spots, 0) ?? 0),
        0,
      ) ?? 0
    );
  }

  private calculateTotalAvailableSpotsParkingLot(parkingLot: DecoratedPartileSpotType): number {
    return parkingLot.spot_types?.reduce((total, spotType) => total + spotType.available_spots, 0) ?? 0;
  }

  private decorateParkingLot(parkingLot: DecoratedPartialParkingLot): DecoratedPartialParkingLot {
    if (this.options.withTotalAvailableSpots) {
      const newParkingLot = map(parkingLot.parking_lots, (row) => {
        return {
          ...row,
          total_available_spots: this.calculateTotalAvailableSpotsParkingLot(row),
        };
      });
      parkingLot.parking_lots = newParkingLot;
      return {
        ...parkingLot,
        total_available_spots: this.calculateTotalAvailableSpotsParkingFloor(parkingLot),
      };
    }
    return parkingLot;
  }

  public decorate(): DecoratedPartialParkingLot | DecoratedPartialParkingLot[] {
    if (this.isMultiple) {
      return (this.input as DecoratedPartialParkingLot[]).map((parkingLot) => this.decorateParkingLot(parkingLot));
    } else {
      return this.decorateParkingLot(this.input as DecoratedPartialParkingLot);
    }
  }
}
