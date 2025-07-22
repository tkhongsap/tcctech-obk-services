export const EventRegistry = [
  {
    name: "ob-parking.receipt.approved",
    payload: {
      account_id: "",
      receipt_id: "",
      total_spending: "",
    },
  },
  {
    name: "ob-parking.receipt.dispute-approved",
    payload: {
      account_id: "",
      receipt_id: "",
      total_spending: "",
    },
  },
  {
    name: "ob-parking.receipt.declined",
    payload: {
      account_id: "",
      receipt_id: "",
      total_spending: "",
      reason_en: "",
      reason_th: "",
    },
  },
] as const;

export type EventName = (typeof EventRegistry)[number]["name"];
