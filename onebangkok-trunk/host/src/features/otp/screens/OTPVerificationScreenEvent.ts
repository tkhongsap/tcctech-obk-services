const screenName = 'OTPVerificationScreen';
const events = [
  'OTP_VERIFIED',
  'OTP_INVALID',
  'FAILED',
  'ABORT',
  'CHANGE_IDENTIFIER',
] as const;

export type OTPVerificationScreenEventTypes = (typeof events)[number];

export const OTPVerificationScreenEventNames: Record<
  OTPVerificationScreenEventTypes,
  string
> = Object.fromEntries(
  events.map(event => [event, `${screenName}.${event}`]),
) as Record<OTPVerificationScreenEventTypes, string>;
