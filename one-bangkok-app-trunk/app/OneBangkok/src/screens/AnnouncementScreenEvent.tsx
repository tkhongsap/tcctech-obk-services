const screenName = 'AnnouncementScreen';
const events = ['CONTINUE'] as const;

export type AnnouncementScreenEventTypes = (typeof events)[number];

export const AnnouncementScreenEventNames: Record<
  AnnouncementScreenEventTypes,
  string
> = Object.fromEntries(
  events.map(event => [event, `${screenName}.${event}`]),
) as Record<AnnouncementScreenEventTypes, string>;
