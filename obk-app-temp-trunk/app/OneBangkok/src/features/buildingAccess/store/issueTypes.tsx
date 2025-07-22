import {hookstate, useHookstate} from '@hookstate/core';
import {IssueTypeData} from 'ob-bms-sdk/dist/api';
import {ListSelect} from '~/components/molecules/SelectList';

interface IssueType {
  issueType?: IssueTypeData[];
}

const DEFAULT_STATE = {
  issueType: [],
};

const issueTypeState = hookstate<IssueType>({...DEFAULT_STATE});

const useIssueTypeState = () => useHookstate(issueTypeState);

const issueTypeAction = {
  reset: () => {
    issueTypeState.set({...DEFAULT_STATE});
  },
  setIssueType: async (issueTypes: IssueTypeData[]) => {
    issueTypeState.issueType.set(issueTypes);
  },
  mapIssueType: async (languageSelected: any) => {
    const issueTypes: ListSelect[] = [];
    const _issueTypeList = issueTypeState.issueType.value ?? [];
    _issueTypeList.map(issueType => {
      const issueTypeFallback = issueType.display_name
        ? issueType.display_name.en
        : issueType.name;
      issueTypes.push({
        name: issueType.display_name[languageSelected] ?? issueTypeFallback,
        value: issueType.id,
      });
    });
    return issueTypes;
  },
};

export {issueTypeState, issueTypeAction, useIssueTypeState};
