import promotions from './promotions.json';

export interface Promotion {
  name: string;
  desc: string;
  logo: string;
}

export const getPromotions = (): Promotion[] => {
  return promotions;
};
