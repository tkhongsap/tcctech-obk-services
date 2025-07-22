import {hookstate, useHookstate} from '@hookstate/core';

interface CreateRequestService {
  towerId: string;
  floorId: string;
  issueTypeId: string;
  title: string;
  description: string;
  image?: string;
  submitted?: boolean;
}

const DEFAULT_STATE = {
  towerId: '',
  floorId: '',
  issueTypeId: '',
  title: '',
  description: '',
  submitted: false,
};

const createRequestServiceState = hookstate<CreateRequestService>({
  ...DEFAULT_STATE,
});

const useCreateRequestServiceState = () =>
  useHookstate(createRequestServiceState);

const createRequestServiceAction = {
  reset: () => {
    createRequestServiceState.set({...DEFAULT_STATE});
  },
  setValueRSFirstPage: (
    towerId: string,
    floorId: string,
    issueTypeId: string,
  ) => {
    createRequestServiceState.set(p => {
      p.towerId = towerId;
      p.floorId = floorId;
      p.issueTypeId = issueTypeId;
      return p;
    });
  },
  setValueRSSecondPage: (title: string, description: string) => {
    createRequestServiceState.set(p => {
      p.title = title;
      p.description = description;
      return p;
    });
  },
  setValueRSThirdPage: (image: string) => {
    createRequestServiceState.set(p => {
      p.image = image;
      return p;
    });
  },
  setSubmitted: (value: boolean) => {
    createRequestServiceState.submitted.set(value);
  },
};

export {
  createRequestServiceState,
  createRequestServiceAction,
  useCreateRequestServiceState,
};
