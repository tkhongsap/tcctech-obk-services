import {hookstate, useHookstate} from '@hookstate/core';
interface AlertType {
  alertType?: 'camera' | 'gallery';
  alertAllReceiptType?: 'camera' | 'gallery';
}
const DEFAULT_STATE = {
  alertType: undefined,
  alertAllReceiptType: undefined,
};
const alertTypeState = hookstate<AlertType>({...DEFAULT_STATE});
const useAlertTypeState = () => useHookstate(alertTypeState);
const alertTypeAction = {
  reset: () => {
    alertTypeState.set({...DEFAULT_STATE});
  },
  set: (type: 'camera' | 'gallery') => {
    alertTypeState.alertType.set(type);
  },
  setAllReceiptType: (type: 'camera' | 'gallery') => {
    alertTypeState.alertAllReceiptType.set(type);
  },
};
export {alertTypeState, alertTypeAction, useAlertTypeState};
