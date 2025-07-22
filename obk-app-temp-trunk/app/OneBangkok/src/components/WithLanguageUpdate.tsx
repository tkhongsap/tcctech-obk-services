import React, {useEffect} from 'react';
import {useHookstate} from '@hookstate/core';
import appLanguageState from '../states/appLanguage/appLanguageState';

const withLanguageUpdate = <P extends object>(
  WrappedComponent: React.ComponentType<P & {currentLanguage: string}>,
) => {
  const WithLanguageUpdate: React.FC<P> = props => {
    const appLanguage = useHookstate(appLanguageState);
    const currentLanguage = appLanguage.currentLanguage.get();

    useEffect(() => {}, [currentLanguage]);

    return <WrappedComponent {...props} currentLanguage={currentLanguage} />;
  };

  return WithLanguageUpdate;
};

export default withLanguageUpdate;
