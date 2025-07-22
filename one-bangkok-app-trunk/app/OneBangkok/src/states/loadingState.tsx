import {hookstate, useHookstate} from '@hookstate/core';

const loadingState = hookstate({
  isShowing: false,
});

export const useLoadingState = () => useHookstate(loadingState);

export const showLoading = async () => {
  if (!loadingState.isShowing.value) {
    loadingState.set(p => {
      p.isShowing = true;
      return p;
    });
  }
};

export const hideLoading = async () => {
  if (loadingState.isShowing.value) {
    loadingState.set(p => {
      p.isShowing = false;
      return p;
    });
  }
};

export default loadingState;
