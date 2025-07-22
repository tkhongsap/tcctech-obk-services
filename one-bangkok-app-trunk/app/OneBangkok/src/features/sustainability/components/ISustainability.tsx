//Banner
export interface IBannerSustain {
  lstBannerA: IBannerItem[];

  sPathBannerRole1B: string;
  sTextBannerRole1B1?: string | null;
  sTextBannerRole1B2?: string | null;

  sPathBannerRole2B: string;
  sTextBannerRole2B1?: string | null;
  sTextBannerRole2B2?: string | null;

  sPathBannerC: string;
  sTextBannerC1?: string | null;
  sTextBannerC2?: string | null;

  sPathCoverLayoutC: string;
  nTimeSlideBanner: number | null;
}

export interface IBannerItem {
  sImagePath: string;
  nType: number;
  sID: string;
  sLinkToURL?: string | null;
  sText?: string | null;
}

//Main Content
export interface IContentLayout {
  nLayoutType: number;
  sTitle: string;
  sIntroduce?: string | null;
  sLayoutBackground?: string | null;
  lstSub: ISubItem[];
}
export interface ISubItem {
  sID: string;
  sPath: string;
  sLabel: string;
  sLabelDesc?: string | null;
}

//Content Detail
export interface IContentDetail {
  sHeaderNav: string;
  sHeaderImagePath: string;
  sTitle: string;
  sIntroduce?: string | null;
  lstContent: IContentDetailItem[];
  sTitleRelated?: string | null;
  lstRelated?: IRelateContentItem[] | null;
}

export interface IContentDetailItem {
  sMode: 'Text' | 'Image' | 'Youtube';
  sContent?: string | null;
  sImagePath?: string | null;
  sYoutubeURL?: string | null;
  sYoutubeID?: string | null;
}

export interface IRelateContentItem {
  sImagePath: string;
  sTitle: string | null;
  sDescription?: string;
  sLinkToID: string;
  nType?: number | null;
  sLinkToURL?: string | null;
  isBanner: boolean;
}

//Digital Library
export interface IContentDigital {
  sTitle: string;
  sSubTitle: string;
  sIntroduce: string;
  lstCategory: IDigitalCategory[];
  sPathBackground?: string | null;
}
export interface IDigitalCategory {
  sID: string;
  sLabel: string;
}
export interface IContentFileDownload {
  sHeaderNav: string;
  sTitle: string;
  sIntroduce?: string | null;
  lstFile: IFileDownloadItem[];
}
export interface IFileDownloadItem {
  sID: string;
  sPathCover?: string | null;
  sPathFile: string;
  sFileName: string;
  sType: string;
  sSize: string;
}
