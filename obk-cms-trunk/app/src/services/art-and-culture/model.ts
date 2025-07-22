export const acceptImageFileTypes = ['image/png', 'image/jpg', 'image/jpeg']
export interface IInputErrors {
  [key: string]: { status: boolean; message: string }
}

export interface IArtCultureContentUpload {
  fileContentBase64: string | ArrayBuffer | null
  fileName: string
  contentType: string
}

export interface IArtCultureContentUploadData {
  id?: any
  imageURL: string
  message: string
  fileName: string
  originalFileName: string
  imageFile?: File

  imageBannerURL: string
  noteBanner: string
  fileNameBanner: string
  originalFileNameBanner: string
  imageSustainabilityURL: string
  noteSustainability: string
  fileNameSustainability: string
  originalFileNameSustainability: string
  imageLibraryURL: string
  noteLibrary: string
  fileNameLibrary: string
  originalFileNameLibrary: string
  imageCertificationsURL: string
  noteCertifications: string
  fileNameCertifications: string
  originalFileNameCertifications: string
  imageOfficeURL: string
  noteOffice: string
  fileNameOffice: string
  originalFileNameOffice: string
  updatedByName?: string
  updatedDateDisplay?: string
}

export interface UploadFileRes {
  isSuccess: boolean
  message: string
  data: string
}

export interface OptionItem {
  label: string
  value: string
}

export interface IFaqItem {
  id: number
  orderNo: number
  isPublished: number
  publishedAt?: Date
  faqTranslation: IFaqTranslation[]
  createdAt: Date
  updatedAt: Date
}
export interface IFaqTranslation {
  id: number
  faqId: number
  locale: string
  question: string
  answer: string
  createdAt: Date
  updatedAt: Date
}

export interface IFaqForm {
  question: string
  answer: string
  publishedAt?: Date
  isPublished: boolean
}

export interface IFaqOrderForm {
  faqItems: IFaqItem[]
}

export class FaqContentData implements IFaqForm {
  question: string
  answer: string
  publishedAt?: Date
  isPublished: boolean

  constructor(data?: IFaqForm) {
    this.question = data?.question ?? ''
    this.answer = data?.answer ?? ''
    this.publishedAt = data?.publishedAt ?? undefined
    this.isPublished = data?.isPublished ?? false
  }
}

export interface IPartnerItem {
  id: number
  partnerTranslation: IPartnerTranslation[]
  createdAt: Date
  updatedAt: Date
}

export interface IPartnerTranslation {
  id: number
  partnerId: number
  locale: string
  title: string
  thumbnail: string
  link: string
  createdAt: Date
  updatedAt: Date
}

export interface IPartnerForm {
  title: string
  thumbnail?: string
  link?: string
}

export class PartnerContentData implements IPartnerForm {
  title: string
  thumbnail?: string
  link?: string

  constructor(data?: IPartnerForm) {
    this.title = data?.title ?? ''
    this.thumbnail = data?.thumbnail ?? ''
    this.link = data?.link ?? ''
  }
}

export interface IArtCTypeItem {
  id: number
  orderType: number
  modifyStrict: boolean
  displayList: boolean
  displayFreeLabel: boolean
  relateProgramIds: number[]
  relateProductIds: number[]
  artCTranslation?: IArtCTranslation[]
  artCCategory: IArtCCategoryItem[]
  programs?: IProgramItem[]
  playlist: IPlaylist[]
  createdAt: Date
  updatedAt: Date
}

export interface IArtCCategoryItem {
  id: number
  artCTypeId: number
  orderCategory: number
  displayList: boolean
  displayFreeLabel: boolean
  relateProgramIds: number[]
  relateProductIds: number[]
  artCTranslation: IArtCTranslation[]
  createdAt: Date
  updatedAt: Date
}

export interface IArtCTranslation {
  id: number
  artCTypeId: number
  artCCategoryId: number
  locale: string
  title: string
  shortDesc?: string
  desc: string
  thumbnail: string
  banner?: string
  categorySectionTitle?: string
  playlistSectionTitle?: string
  programSectionTitle?: string
  openingHours?: string[]
  locations?: string[]
  enterFee?: number
  externalLink?: string
  tags: string[]
  createdAt: Date
  updatedAt: Date
}

export interface IArtCTypeForm {
  title: string
  shortDesc: string
  desc: string
  thumbnail: string
  banner: string
  categorySectionTitle: string
  playlistSectionTitle: string
  programSectionTitle: string
  openingHours: string[]
  locations: string[]
  enterFee: number
  externalLink: string
  displayList: boolean
  displayFreeLabel: boolean
  playlist: string[]
  tags: string[]
  relateProgramIds: number[]
  relateProductIds: number[]
}

export class ArtCTypeFormData implements IArtCTypeForm {
  title: string
  shortDesc: string
  desc: string
  thumbnail: string
  banner: string
  categorySectionTitle: string
  playlistSectionTitle: string
  programSectionTitle: string
  openingHours: string[]
  locations: string[]
  enterFee: number
  externalLink: string
  displayList: boolean
  displayFreeLabel: boolean
  playlist: string[]
  tags: string[]
  relateProgramIds: number[]
  relateProductIds: number[]

  constructor(data?: IArtCTypeForm) {
    this.title = data?.title || ''
    this.shortDesc = data?.shortDesc || ''
    this.desc = data?.desc || ''
    this.thumbnail = data?.thumbnail || ''
    this.banner = data?.banner || ''
    this.categorySectionTitle = data?.categorySectionTitle || ''
    this.playlistSectionTitle = data?.playlistSectionTitle || ''
    this.programSectionTitle = data?.programSectionTitle || ''
    this.openingHours = data?.openingHours || []
    this.locations = data?.locations || []
    this.enterFee = data?.enterFee || 0
    this.externalLink = data?.externalLink || ''
    this.displayList = data?.displayList || false
    this.displayFreeLabel = data?.displayFreeLabel || false
    this.playlist = data?.playlist || []
    this.tags = data?.tags || []
    this.relateProgramIds = data?.relateProgramIds || []
    this.relateProductIds = data?.relateProductIds || []
  }
}

interface IProgramItem {
  id: number
}

export interface IAboutUs {
  id: number
  aboutTranslation: IAboutUsTranslation[]
  partners: IPartnerItem[]
  createdAt: Date
  updatedAt: Date
}

export interface IAboutUsTranslation {
  id: number
  aboutId: number
  locale: string
  content: string
  createdAt: Date
  updatedAt: Date
}

export interface IAboutUsForm {
  content?: string
  partnersItems: string[]
}

export class AboutUsContentData implements IAboutUsForm {
  content?: string
  partnersItems: string[]

  constructor(data?: IAboutUsForm) {
    this.content = data?.content ?? ''
    this.partnersItems = data?.partnersItems ?? []
  }
}

export interface IAddOnTranslation {
  id: number
  addOnId: number
  locale: string
  title: string
  desc: string
  thumbnail: string
  banner: string
  audio: string
  video: string
  tags: string[]
  createdAt: Date
  updatedAt: Date
}

export interface IAddOnItem {
  id: number
  type: string
  isPublished: boolean
  publishedAt?: Date
  createdAt: Date
  updatedAt: Date
  partners: IPartnerItem[]
  addOnTranslation: IAddOnTranslation[]
}

export interface IAddOnForm {
  type: string
  isPublished: boolean
  publishedAt?: Date
  title: string
  desc: string
  thumbnail: string
  banner: string
  audio: string
  video: string
  tags: string[]
  partners: IPartnerItem[]
}

export class AddOnContentData implements IAddOnForm {
  type: string
  isPublished: boolean
  publishedAt?: Date
  title: string
  desc: string
  thumbnail: string
  banner: string
  audio: string
  video: string
  tags: string[]
  partners: IPartnerItem[]

  constructor(data?: IAddOnForm) {
    this.type = data?.type || ''
    this.isPublished = data?.isPublished || false
    this.publishedAt = data?.publishedAt || undefined
    this.title = data?.title || ''
    this.desc = data?.desc || ''
    this.thumbnail = data?.thumbnail || ''
    this.banner = data?.banner || ''
    this.audio = data?.audio || ''
    this.video = data?.video || ''
    this.tags = data?.tags || []
    this.partners = data?.partners || []
  }
}

export interface IProgramTranslation {
  id: number
  programId: number
  locale: string
  title: string
  shortDesc: string
  desc: string
  author: string
  thumbnail: string
  banner: string
  openingHours: string[]
  locations: string[]
  enterFee: number
  externalLink: string
  infoItems: IProgramInfoItem[]
  tags: string[]
  audio?: string
  video?: string
  createdAt: Date
  updatedAt: Date
}

export interface IProgram {
  id: number
  artCTypeId: number
  artCCategoryId?: number
  isPublished: boolean
  isProduct: boolean
  productPrice: number
  periodAt?: Date
  periodEnd?: Date
  publishedAt?: Date
  displayFreeLabel: boolean
  type: string[]
  relateProgramIds: number[]
  relateProductIds: number[]
  createdAt: Date
  updatedAt: Date
  programTranslation: IProgramTranslation[]
  addOns: IAddOnItem[]
  partners: IPartnerItem[]
}

export interface IProgramInfoItem {
  title: string
  content: string
}

export interface IProgramForm {
  artCTypeId?: number
  artCCategoryId?: number
  isPublished: boolean
  periodAt?: Date
  periodEnd?: Date
  publishedAt?: Date
  isProduct: boolean
  productPrice: number
  type: string[]
  title: string
  shortDesc: string
  desc: string
  author: string
  thumbnail: string
  banner: string
  openingHours: string[]
  locations: string[]
  enterFee: number
  displayFreeLabel: boolean
  externalLink?: string
  infoItems: IProgramInfoItem[]
  tags: string[]
  audio?: string
  video?: string
  relateProgramIds: number[]
  relateProductIds: number[]
  partners: IPartnerItem[]
  addOns: IAddOnItem[]
}

export class ProgramContentData implements IProgramForm {
  artCTypeId?: number
  artCCategoryId?: number
  isPublished: boolean
  periodAt?: Date
  periodEnd?: Date
  publishedAt?: Date
  isProduct: boolean
  productPrice: number
  type: string[]
  title: string
  shortDesc: string
  desc: string
  author: string
  thumbnail: string
  banner: string
  openingHours: string[]
  locations: string[]
  enterFee: number
  displayFreeLabel: boolean
  externalLink?: string
  infoItems: IProgramInfoItem[]
  tags: string[]
  audio?: string
  video?: string
  relateProgramIds: number[]
  relateProductIds: number[]
  partners: IPartnerItem[]
  addOns: IAddOnItem[]

  constructor(data?: IProgramForm) {
    this.artCTypeId = data?.artCTypeId
    this.artCCategoryId = data?.artCCategoryId
    this.isPublished = data?.isPublished ?? false
    this.periodAt = data?.periodAt ?? undefined
    this.periodEnd = data?.periodEnd ?? undefined
    this.publishedAt = data?.publishedAt ?? undefined
    this.isProduct = data?.isProduct ?? false
    this.productPrice = data?.productPrice || 0
    this.type = data?.type ?? []
    this.title = data?.title ?? ''
    this.shortDesc = data?.shortDesc ?? ''
    this.desc = data?.desc ?? ''
    this.author = data?.author ?? ''
    this.thumbnail = data?.thumbnail ?? ''
    this.banner = data?.banner ?? ''
    this.openingHours = data?.openingHours || []
    this.locations = data?.locations || []
    this.enterFee = data?.enterFee || 0
    this.displayFreeLabel = data?.displayFreeLabel ?? false
    this.externalLink = data?.externalLink || ''
    this.infoItems = data?.infoItems || []
    this.tags = data?.tags || []
    this.audio = data?.audio || ''
    this.video = data?.video || ''
    this.relateProgramIds = data?.relateProgramIds || []
    this.relateProductIds = data?.relateProductIds || []
    this.partners = data?.partners || []
    this.addOns = data?.addOns || []
  }
}

export interface ILandingPage {
  highlightPrograms: IProgramItem[]
  highlightAutoPlay: number
  sectionOrder: string[]
  artCTypes: IArtCTypeItem[]
  translation: ILandingPageTranslation[]
  createdAt: Date
  updatedAt: Date
}

export interface ILandingPageTranslation {
  locale: string
  content: ILandingPageTranslationContent
}

export interface ILandingPageTranslationContent {
  artCTitle: string
  artCDesc: string
  artMapTitle: string
  artMapDesc: string
  programTitle: string
  programDesc: string
}

export interface ILandingPageForm {
  programsId: number[]
  highlightAutoPlay: number
  artCTypesId: number[]
  sectionOrder: string[]
  artCTitle: string
  artCDesc: string
  artMapTitle: string
  artMapDesc: string
  programTitle: string
  programDesc: string
}

export class LandingPageFormData implements ILandingPageForm {
  programsId: number[]
  highlightAutoPlay: number
  artCTypesId: number[]
  sectionOrder: string[]
  artCTitle: string
  artCDesc: string
  artMapTitle: string
  artMapDesc: string
  programTitle: string
  programDesc: string

  constructor(data?: ILandingPageForm) {
    this.programsId = data?.programsId || []
    this.highlightAutoPlay = data?.highlightAutoPlay || 5
    this.artCTypesId = data?.artCTypesId || []
    this.sectionOrder = data?.sectionOrder || ['art+c', 'map', 'programs']
    this.artCTitle = data?.artCTitle || ''
    this.artCDesc = data?.artCDesc || ''
    this.artMapTitle = data?.artMapTitle || ''
    this.artMapDesc = data?.artMapDesc || ''
    this.programTitle = data?.programTitle || ''
    this.programDesc = data?.programDesc || ''
  }
}

export interface IPlaylist {
  id: number
  isPublished: number
  publishedAt?: Date
  playlistTranslation: IPlaylistTranslation[]
  createdAt: Date
  updatedAt: Date
}
export interface IPlaylistTranslation {
  id: number
  playlistId: number
  locale: string
  title: string
  desc: string
  author: string
  thumbnail: string
  durations: number
  link: string
  createdAt: Date
  updatedAt: Date
}

export interface IPlaylistForm {
  isPublished: boolean
  publishedAt?: Date
  title: string
  desc: string
  author: string
  thumbnail: string
  durations: number
  link: string
}

export class PlaylistContentData implements IPlaylistForm {
  isPublished: boolean
  publishedAt?: Date
  title: string
  desc: string
  author: string
  thumbnail: string
  durations: number
  link: string

  constructor(data?: IFaqForm) {
    this.isPublished = data?.isPublished ?? false
    this.publishedAt = data?.publishedAt ?? undefined
    this.title = data?.question ?? ''
    this.desc = data?.answer ?? ''
    this.author = ''
    this.thumbnail = ''
    this.durations = 0
    this.link = ''
  }
}
