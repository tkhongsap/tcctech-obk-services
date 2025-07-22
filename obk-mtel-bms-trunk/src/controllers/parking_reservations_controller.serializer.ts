import { map } from 'lodash';
import { Prisma } from '../../db/client';
import {
  ParkingReservationReservedListResponse,
  ParkingReservationDetailResponse,
  ParkingReservationResponse,
} from './parking_reservations_controller.interfaces';
export function parkingReservationsSerializer(
  parkingReservations: Prisma.ParkingReservationGetPayload<{
    include: {
      parking_space: {
        include: {
          blocker: true;
          parking_lot: { include: { parking_floors: true } };
        };
      };
    };
  }>[],
): ParkingReservationResponse[] {
  return map(parkingReservations, (parkingReservation) => {
    return parkingReservationShowSerializer(parkingReservation);
  });
}

export function parkingReservationShowSerializer(
  parkingReservation: Prisma.ParkingReservationGetPayload<{
    include: {
      parking_space: {
        include: {
          blocker: true;
          parking_lot: { include: { parking_floors: true } };
        };
      };
    };
  }>,
): ParkingReservationResponse {
  const parkingSpace = {
    id: parkingReservation.parking_space.id,
    name: parkingReservation.parking_space.name,
    parking_lot_id: parkingReservation.parking_space.parking_lot_id,
    available: parkingReservation.parking_space.available,
    created_at: parkingReservation.parking_space.created_at,
    updated_at: parkingReservation.parking_space.updated_at,
  };

  const parkingLot = {
    id: parkingReservation.parking_space.parking_lot.id,
    uid: parkingReservation.parking_space.parking_lot.uid,
    name: parkingReservation.parking_space.parking_lot.name,
    display_name: parkingReservation.parking_space.parking_lot.display_name,
    created_at: parkingReservation.parking_space.parking_lot.created_at,
    updated_at: parkingReservation.parking_space.parking_lot.updated_at,
    parking_floor_id: parkingReservation.parking_space.parking_lot.parking_floor_id,
    total_spots: parkingReservation.parking_space.parking_lot.total_spots,
  };

  const blocker = {
    id: parkingReservation.parking_space.blocker?.id,
    uid: parkingReservation.parking_space.blocker?.uid,
    meta: parkingReservation.parking_space.blocker?.meta,
    parking_space_id: parkingReservation.parking_space.blocker?.parking_space_id,
    created_at: parkingReservation.parking_space.blocker?.created_at,
    updated_at: parkingReservation.parking_space.blocker?.updated_at,
  };

  const parkingFloor = {
    id: parkingReservation.parking_space.parking_lot.parking_floors.id,
    uid: parkingReservation.parking_space.parking_lot.parking_floors.uid,
    name: parkingReservation.parking_space.parking_lot.parking_floors.name,
    display_name: parkingReservation.parking_space.parking_lot.parking_floors.display_name,
    created_at: parkingReservation.parking_space.parking_lot.created_at,
    updated_at: parkingReservation.parking_space.parking_lot.updated_at,
    parking_floor_id: parkingReservation.parking_space.parking_lot.parking_floors.parking_tower_id,
  };

  return {
    id: parkingReservation.id,
    parking_space_id: parkingReservation.parking_space_id,
    member_id: parkingReservation.member_id,
    created_at: parkingReservation.created_at,
    updated_at: parkingReservation.updated_at,
    start_time: parkingReservation.start_time,
    fee: parkingReservation.fee,
    status: parkingReservation.status,
    reservation_number: parkingReservation.reservation_number,
    parking_space: parkingSpace,
    parking_lot: parkingLot,
    parking_floor: parkingFloor,
    blocker,
  };
}

export function parkingReservationReservedListSerializer(
  parkingReservationsReservedList: Prisma.ParkingReservationGetPayload<{
    include: {
      parking_space: {
        include: {
          blocker: true;
          parking_lot: { include: { parking_floors: true } };
        };
      };
    };
  }>[],
): ParkingReservationReservedListResponse[] {
  return map(parkingReservationsReservedList, (parkingReservation) => {
    return parkingReservationListSerializer(parkingReservation);
  });
}

export function parkingReservationListSerializer(
  parkingReservation: Prisma.ParkingReservationGetPayload<{
    include: {
      parking_space: {
        include: {
          blocker: true;
          parking_lot: { include: { parking_floors: true } };
        };
      };
    };
  }>,
): ParkingReservationReservedListResponse {
  const parkingSpace = {
    id: parkingReservation.parking_space.id,
    name: parkingReservation.parking_space.name,
    parking_lot_id: parkingReservation.parking_space.parking_lot_id,
    available: parkingReservation.parking_space.available,
    blockers: {
      id: parkingReservation.parking_space.blocker?.id,
      uid: parkingReservation.parking_space.blocker?.uid,
      meta: parkingReservation.parking_space.blocker?.meta,
    },
    parking_lot: {
      id: parkingReservation.parking_space.parking_lot.id,
      name: parkingReservation.parking_space.parking_lot.name,
      display_name: parkingReservation.parking_space.parking_lot.display_name,
      parking_floor_id: parkingReservation.parking_space.parking_lot.parking_floor_id,
      parking_floor: {
        id: parkingReservation.parking_space.parking_lot.parking_floors.id,
        uid: parkingReservation.parking_space.parking_lot.parking_floors.uid,
        name: parkingReservation.parking_space.parking_lot.parking_floors.name,
        display_name: parkingReservation.parking_space.parking_lot.parking_floors.display_name,
        parking_tower_id: parkingReservation.parking_space.parking_lot.parking_floors.parking_tower_id,
      },
    },
  };

  return {
    id: parkingReservation.id,
    parking_space_id: parkingReservation.parking_space_id,
    member_id: parkingReservation.member_id,
    created_at: parkingReservation.created_at,
    updated_at: parkingReservation.updated_at,
    start_time: parkingReservation.start_time,
    fee: parkingReservation.fee,
    status: parkingReservation.status,
    reservation_number: parkingReservation.reservation_number,
    parking_space: parkingSpace,
  };
}

export function parkingReservationDetailSerializer(
  parkingReservation: Prisma.ParkingReservationGetPayload<{
    include: {
      parking_space: {
        include: {
          blocker: true;
          parking_lot: { include: { parking_floors: true } };
        };
      };
      payment: true;
    };
  }>,
): ParkingReservationDetailResponse {
  const parkingLot = {
    id: parkingReservation.parking_space.parking_lot.id,
    name: parkingReservation.parking_space.parking_lot.name,
    display_name: parkingReservation.parking_space.parking_lot.display_name,
    created_at: parkingReservation.parking_space.parking_lot.created_at,
    updated_at: parkingReservation.parking_space.parking_lot.updated_at,
    parking_floor_id: parkingReservation.parking_space.parking_lot.parking_floors.parking_tower_id,
  };

  const parkingSpace = {
    id: parkingReservation.parking_space.id,
    name: parkingReservation.parking_space.name,
    available: parkingReservation.parking_space.available,
  };

  const blocker = {
    id: parkingReservation.parking_space.blocker?.id,
    uid: parkingReservation.parking_space.blocker?.uid,
    meta: parkingReservation.parking_space.blocker?.meta,
    parking_space_id: parkingReservation.parking_space.blocker?.parking_space_id,
    created_at: parkingReservation.parking_space.blocker?.created_at,
    updated_at: parkingReservation.parking_space.blocker?.updated_at,
  };

  const parkingFloor = {
    id: parkingReservation.parking_space.parking_lot.parking_floors.id,
    uid: parkingReservation.parking_space.parking_lot.parking_floors.uid,
    name: parkingReservation.parking_space.parking_lot.parking_floors.name,
    display_name: parkingReservation.parking_space.parking_lot.parking_floors.display_name,
    created_at: parkingReservation.parking_space.parking_lot.parking_floors.created_at,
    updated_at: parkingReservation.parking_space.parking_lot.parking_floors.updated_at,
  };

  const payment = {
    id: parkingReservation.payment?.id,
    payment_url: parkingReservation.payment?.payment_url,
    description: parkingReservation.payment?.description,
    reference_number: parkingReservation.payment?.reference_number,
    invoice_number: parkingReservation.payment?.invoice_number,
    amount: parkingReservation.payment?.amount,
    vat_amount: parkingReservation.payment?.vat_amount,
    total_amount: parkingReservation.payment?.total_amount,
    status: parkingReservation.payment?.status,
    paid_at: parkingReservation.payment?.paid_at,
    expired_at: parkingReservation.payment?.expired_at,
    meta: parkingReservation.payment?.meta,
    parking_reservation_id: parkingReservation.payment?.parking_reservation_id,
    created_at: parkingReservation.payment?.created_at,
    updated_at: parkingReservation.payment?.updated_at,
  };

  return {
    id: parkingReservation.id,
    parking_space_id: parkingReservation.parking_space_id,
    member_id: parkingReservation.member_id,
    created_at: parkingReservation.created_at,
    updated_at: parkingReservation.updated_at,
    start_time: parkingReservation.start_time,
    fee: parkingReservation.fee,
    status: parkingReservation.status,
    reservation_number: parkingReservation.reservation_number,
    parking_space: parkingSpace,
    parking_lot: parkingLot,
    parking_floor: parkingFloor,
    blocker: blocker,
    payment,
  };
}
