import {ImageSourcePropType} from 'react-native';

export interface IProgram {
  id: number;
  artCTypeId: number;
  artCCategoryId: number | null;
  type: string[];
  isPublished: boolean;
  periodAt: Date;
  periodEnd: Date;
  publishedAt: Date;
  isProduct: boolean;
  productPrice: number;
  displayFreeLabel: boolean;
  createdAt: Date;
  updatedAt: Date;
  programTranslations: IProgramTranslation;
  addOns: IAddOn[];
  partners: IPartner[];
  isGetTicketAvailable?: boolean;
}

export interface IProgramTranslation {
  id: number;
  programId: number;
  locale: string;
  title: string;
  shortDesc: string;
  desc: string;
  author: string;
  thumbnail: string;
  banner: string;
  openingHours: string[];
  locations: string[];
  enterFee: number;
  externalLink: string;
  infoItems: IProgramInfoItem[];
  audio?: string;
  video?: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IProgramInfoItem {
  title: string;
  content: string;
}

export interface IAddOn {
  id: number;
  type: string;
  isPublished: boolean;
  publishedAt: Date;
  createdAt: Date;
  updatedAt: Date;
  partners: IPartner[];
  addOnTranslations: IAddOnTranslation;
}

export interface IAddOnTranslation {
  id: number;
  addOnId: number;
  locale: string;
  title: string;
  desc: string;
  thumbnail: string;
  banner: string;
  audio: string;
  video: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IPartner {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  partnerTranslations: IPartnerTranslation;
}

export interface IPartnerTranslation {
  id: number;
  partnerId: number;
  locale: string;
  title: string;
  thumbnail: string;
  link: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IArtCType {
  id: number;
  orderType: number;
  modifyStrict: boolean;
  displayList: boolean;
  displayFreeLabel: boolean;
  playlist: number[] | null;
  createdAt: Date;
  updatedAt: Date;
  artCCategory: IArtCCategory[];
  artCTranslation: IArtCTranslation;
  programs: IProgram[];
}

export interface IArtCCategory {
  id: number;
  artCTypeId: number;
  orderCategory: number;
  displayList: boolean;
  displayFreeLabel: boolean;
  createdAt: Date;
  updatedAt: Date;
  artCTranslation: IArtCTranslation;
  programs: IProgram[];
}

export interface IArtCTranslation {
  id: number;
  artCTypeId: number;
  artCCategoryId: number | null;
  locale: string;
  title: string;
  shortDesc: string;
  desc: string;
  thumbnail: string;
  banner: string;
  categorySectionTitle: string;
  playlistSectionTitle: string;
  programSectionTitle: string;
  openingHours: string[];
  locations: string[];
  enterFee: number;
  externalLink: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IPlaylist {
  id: number;
  publishedAt: Date;
  title: string;
  desc: string;
  author: string;
  thumbnail: string;
  durations: number;
  link: string;
}

export interface ILandingPage {
  highlightPrograms: IProgram[];
  highlightAutoPlay: number;
  sectionOrder: string[];
  artCTypes: IArtCType[];
  translation: ILandingContent;
  programs: IProgram[];
}

export interface ILandingContent {
  locale: string;
  content: ILandingTranslation;
}

export interface ILandingTranslation {
  artCTitle: string;
  artCDesc: string;
  artMapTitle: string;
  artMapDesc: string;
  programTitle: string;
  programDesc: string;
}

export interface IAddOnProgramItem {
  type: string;
  id: number | string;
  artCTypeId?: number;
  addOnType?: string;
  thumbnail: string;
  thumbnailReq?: ImageSourcePropType;
  title: string;
  link?: string;
  locations?: string[];
  periodAt?: Date;
  periodEnd?: Date;
  publishedAt?: Date;
  isGetTicketAvailable?: boolean;
}

export interface IArtCPage {
  artCTypes: IArtCType[];
  artCType: IArtCType | undefined;
  programs: IProgram[];
  playlist: IPlaylist[];
}

export interface IArtCCategoryPage {
  artCType: IArtCType | undefined;
  artCCategory: IArtCCategory | undefined;
  programs: IProgram[];
}

export interface IProgramListPage {
  artCTypes: IArtCType[];
  programsOnGoing: IProgram[];
  programsUpcoming: IProgram[];
}

export interface IProgramPage {
  artCType: IArtCType | undefined;
  artCCategory: IArtCCategory | undefined;
  program: IProgram | undefined;
  relatePrograms: IProgram[];
  relateProducts: IProgram[];
}

export interface IAddOnPage {
  addOn: IAddOn | undefined;
  relateAddOns: IAddOn[];
  relatePrograms: IProgram[];
}

export interface ITagPage {
  artCTypes: IArtCType[];
  programs: IProgram[];
  addOns: IAddOn[];
}

export const mappingLandingPage = (locale: string, data: any): ILandingPage => {
  const hlPrograms: IProgram[] = mappingProgramItems(
    locale,
    data.highlightPrograms,
  );

  const programs: IProgram[] = mappingProgramItems(locale, data.programs);

  const artCTypes: IArtCType[] = mappingArtCTypes(locale, data.artCTypes);

  const translation: ILandingContent = data.translation.find(
    (t: any) => t.locale === locale,
  );

  return {
    highlightPrograms: hlPrograms,
    highlightAutoPlay: data.highlightAutoPlay,
    sectionOrder: data.sectionOrder,
    artCTypes,
    translation,
    programs,
  };
};

export const mappingArtCPage = (locale: string, data: any): IArtCPage => {
  const artCType: IArtCType = mappingArtCTypes(locale, data.artCType)[0];

  const programs: IProgram[] = mappingProgramItems(locale, data.programs);

  const playlist: IPlaylist[] = data.playlist
    ? mappingPlaylists(locale, data.playlist)
    : [];

  return {
    artCTypes: mappingArtCTypes(locale, data.artCTypes),
    artCType,
    programs,
    playlist,
  };
};

export const mappingArtCTypes = (locale: string, data: any): IArtCType[] => {
  const artCTypes: IArtCType[] = [];
  data.forEach((aItem: any) => {
    const artCType: IArtCType | undefined = mappingArtCType(locale, aItem);

    if (artCType) {
      artCTypes.push(artCType);
    }
  });

  return artCTypes;
};

export const mappingArtCType = (
  locale: string,
  data: any,
): IArtCType | undefined => {
  const artCCategories: IArtCCategory[] =
    data.artCCategory && data.artCCategory.length > 0
      ? mappingArtCCategories(locale, data.artCCategory)
      : [];

  const programs: IProgram[] =
    (data.programs && data.programs.length > 0) ||
    (data.program && data.program.length > 0)
      ? mappingProgramItems(locale, data.programs || data.program)
      : [];

  const aTrans: IArtCTranslation = data.artCTranslation.find(
    (a: any) => a.locale === locale,
  );

  if (!aTrans) {
    return;
  }

  return {
    id: data.id,
    orderType: data.orderType,
    displayList: data.displayList,
    displayFreeLabel: data.displayFreeLabel,
    modifyStrict: data.modifyStrict,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
    artCCategory: artCCategories,
    artCTranslation: aTrans,
    playlist: data.playlist,
    programs,
  };
};

export const mappingArtCCategories = (
  locale: string,
  data: any,
): IArtCCategory[] => {
  const artCCategories: IArtCCategory[] = [];
  data.forEach((acItem: any) => {
    const artCCategory: IArtCCategory | undefined = mappingArtCCategory(
      locale,
      acItem,
    );

    if (artCCategory) {
      artCCategories.push(artCCategory);
    }
  });

  return artCCategories;
};

export const mappingArtCCategory = (
  locale: string,
  data: any,
): IArtCCategory | undefined => {
  if (!data) {
    return;
  }

  const programs: IProgram[] =
    data.programs && data.programs.length > 0
      ? mappingProgramItems(locale, data.programs)
      : [];

  const acTrans: IArtCTranslation = data.artCTranslation.find(
    (ac: any) => ac.locale === locale,
  );

  if (!acTrans) {
    return;
  }

  return {
    id: data.id,
    artCTypeId: data.artCTypeId,
    orderCategory: data.orderCategory,
    displayList: data.displayList,
    displayFreeLabel: data.displayFreeLabel,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
    artCTranslation: acTrans,
    programs,
  };
};

export const mappingPlaylists = (locale: string, data: any): IPlaylist[] => {
  const playlists: IPlaylist[] = [];
  data.forEach((pItem: any) => {
    const playlist: IPlaylist | undefined = mappingPlaylist(locale, pItem);

    if (playlist) {
      playlists.push(playlist);
    }
  });

  return playlists;
};

export const mappingPlaylist = (
  locale: string,
  data: any,
): IPlaylist | undefined => {
  if (!data) {
    return;
  }

  const playlistTranslation = data.playlistTranslation.find(
    (p: any) => p.locale === locale,
  );

  if (!playlistTranslation) {
    return;
  }

  return {
    id: data.id,
    publishedAt: data.publishedAt,
    title: playlistTranslation.title,
    desc: playlistTranslation.desc,
    author: playlistTranslation.author,
    thumbnail: playlistTranslation.thumbnail,
    durations: playlistTranslation.durations,
    link: playlistTranslation.link,
  };
};

export const mappingProgramItems = (locale: string, data: any): IProgram[] => {
  const programs: IProgram[] = [];
  if (data && data.length > 0) {
    data.forEach((pItem: any) => {
      const program = mappingProgramItem(locale, pItem);
      if (program) {
        programs.push(program);
      }
    });
  }

  return programs;
};

export const mappingProgramItem = (
  locale: string,
  data: any,
): IProgram | undefined => {
  const addOns: IAddOn[] =
    data.addOns && data.addOns.length > 0
      ? mappingAddOns(locale, data.addOns)
      : [];

  const partners: IPartner[] = mappingPartners(locale, data.partners);

  const pTrans: IProgramTranslation = data.programTranslation.find(
    (p: any) => p.locale === locale,
  );

  if (!pTrans) {
    return;
  }

  return {
    id: data.id,
    artCTypeId: data.artCTypeId,
    artCCategoryId: data.artCCategoryId,
    type: data.type,
    periodAt: data.periodAt,
    periodEnd: data.periodEnd,
    isPublished: data.isPublished,
    publishedAt: data.publishedAt,
    isProduct: data.isProduct,
    productPrice: data.productPrice,
    displayFreeLabel: data.displayFreeLabel,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
    programTranslations: pTrans,
    addOns,
    partners,
  };
};

export const mappingAddOns = (locale: string, data: any): IAddOn[] => {
  const addOns: IAddOn[] = [];
  if (data && data.length > 0) {
    data.forEach((item: any) => {
      const addOn: IAddOn | undefined = mappingAddOn(locale, item);

      if (addOn) {
        addOns.push(addOn);
      }
    });
  }

  return addOns;
};

export const mappingAddOn = (locale: string, data: any): IAddOn | undefined => {
  const aTrans: IAddOnTranslation = data.addOnTranslation.find(
    (a: any) => a.locale === locale,
  );

  if (!aTrans) {
    return;
  }

  const partners: IPartner[] = mappingPartners(locale, data.partners);

  return {
    id: data.id,
    type: data.type,
    isPublished: data.isPublished,
    publishedAt: data.publishedAt,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
    addOnTranslations: aTrans,
    partners,
  };
};

export const mappingPartners = (locale: string, data: any): IPartner[] => {
  const partners: IPartner[] = [];
  if (data && data.length > 0) {
    data.forEach((item: any) => {
      const partner: IPartner | undefined = mappingPartner(locale, item);

      if (partner) {
        partners.push(partner);
      }
    });
  }

  return partners;
};

export const mappingPartner = (
  locale: string,
  data: any,
): IPartner | undefined => {
  const ptTrans: IPartnerTranslation = data.partnerTranslation.find(
    (pt: any) => pt.locale === locale,
  );

  if (!ptTrans) {
    return;
  }

  return {
    id: data.id,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
    partnerTranslations: ptTrans,
  };
};
