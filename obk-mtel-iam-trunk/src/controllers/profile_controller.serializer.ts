import { Prisma } from '../../db/client';
import { ProfileResult } from './profile_controller.interface';

export function ProfileSerializer(profile: Prisma.profileGetPayload<true>): ProfileResult {
  return {
    profile: {
      first_name: profile.first_name,
      middle_name: profile.middle_name,
      last_name: profile.last_name,
      dob: new Date(profile.dob).toISOString(),
      title: profile.title,
      gender: profile.gender,
      created_at: new Date(profile.created_at).toISOString(),
    },
  };
}
