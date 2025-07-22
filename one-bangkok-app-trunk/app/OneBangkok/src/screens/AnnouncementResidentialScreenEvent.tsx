const screenName = 'AnnouncementResidentialScreen';
const events = ['CONTINUE'] as const;

export type AnnouncementResidentialScreenEventTypes = (typeof events)[number];

export const AnnouncementResidentialScreenEventNames: Record<
  AnnouncementResidentialScreenEventTypes,
  string
> = Object.fromEntries(
  events.map(event => [event, `${screenName}.${event}`]),
) as Record<AnnouncementResidentialScreenEventTypes, string>;
