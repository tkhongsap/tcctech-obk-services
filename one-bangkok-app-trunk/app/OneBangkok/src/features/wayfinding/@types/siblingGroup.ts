export type SiblingGroup = {
  externalId: string;
  nodes: {
    node: string;
    map: string;
    siblingGroups?: {
      label: string;
      siblings: string[];
    }[];
  }[];
};
