//Main Content
export interface IMainPage {
  lstEvent: IEvent[];
  lstBanner: IBannerItem[];
  lstWhatHappen: IContentCardWhatHappen[];
  lstExplore: IContentCardExplore[];
  nTimeSlideBanner: number;
  canCheckDontShowEvent: boolean;
}
export interface IEvent {
  sID: string;
  sImagePath: string;
  isShowDontShowAgain: boolean;
}
export interface IBannerItem {
  sTitle: any;
  sImagePath: string;
  isImage: boolean;
  nType: number;
  sID: string;
  sLinkToURL?: string | null;
  sText?: string | null;
}

export interface IContentCardWhatHappen {
  sID: string;
  sCategolyID: string;
  sCategory: string;
  sTitle: string;
  sLocation: string;
  sDate: string;
  sCoverImagePath: string;
  dStart?: Date;
  dEnd?: Date;
}
export interface IContentCardExplore {
  sID: string;
  sCoverImagePath: string;
  sTitle: string;
}
//What Happen All
export interface IWhatHappenAll {
  lstCategory: IWhatHappenCategory[];
  lstWhatHappen: IContentCardWhatHappen[];
}
export interface IWhatHappenCategory {
  sID: string;
  sCategoryName: string;
}

//Content Detail
export interface IContentMarcomDetail {
  sHeaderNav: string;
  sID: string;
  sHeaderImagePath: string;
  sTextImage?: string | null;
  sTitle?: string | null;
  sIntroduce?: string | null;
  lstContent: IContentDetailItem[];
  sTitleRelated?: string | null;
  sSubTitleRelated?: string | null;
  lstRelated?: IRelateContentItem[] | null;
  lstTag?: ITag[] | null;
  isArtAndCulture: boolean;
  nTypeLink?: number | null;
  nSystemType?: number | null;
  nArtAndCultureType?: number | null;
  sDetailLink?: string | null;
  sMode: string;
}

export interface IContentDetailItem {
  sMode: 'Text' | 'Image' | 'Youtube';
  sContent?: string | null;
  sImagePath?: string | null;
  sYoutubeURL?: string | null;
  sYoutubeID?: string | null;
}

export interface IRelateContentItem {
  sID: string;
  sImagePath: string;
  sTitle: string | null;
  sDescription?: string;
  sLinkToID: string;
  nType?: number | null;
  sLinkToURL?: string | null;
  isBanner: boolean;
  isArtAndCultureRelated?: boolean | null;
}

export interface ITag {
  sTagName: string;
}
