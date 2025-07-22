export interface ISustainabilityContentUpload {
  fileContentBase64: string | ArrayBuffer | null
  fileName: string
  contentType: string
}

export interface ISustainabilityData {
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

export class SustainabilityData implements ISustainabilityData {
  imageURL: string
  message: string
  fileName: string
  originalFileName: string
  imageFile?: File

  imageBannerURL: string
  noteBanner: string
  fileNameBanner: string
  originalFileNameBanner: string
  imageBannerFile?: File
  imageSustainabilityURL: string
  noteSustainability: string
  fileNameSustainability: string
  originalFileNameSustainability: string
  imageSustainabilityFile?: File
  imageLibraryURL: string
  noteLibrary: string
  fileNameLibrary: string
  originalFileNameLibrary: string
  imageLibraryFile?: File
  imageCertificationsURL: string
  noteCertifications: string
  fileNameCertifications: string
  originalFileNameCertifications: string
  imageCertificationsFile?: File
  imageOfficeURL: string
  noteOffice: string
  fileNameOffice: string
  originalFileNameOffice: string
  imageOfficeFile?: File

  constructor(data?: ISustainabilityData) {
    this.imageURL = data?.imageURL ?? ''
    this.message = data?.message ?? ''
    this.fileName = data?.fileName ?? ''
    this.originalFileName = data?.originalFileName ?? ''

    this.imageBannerURL = data?.imageBannerURL ?? ''
    this.noteBanner = data?.noteBanner ?? ''
    this.fileNameBanner = data?.fileNameBanner ?? ''
    this.originalFileNameBanner = data?.originalFileNameBanner ?? ''
    this.imageSustainabilityURL = data?.imageSustainabilityURL ?? ''
    this.noteSustainability = data?.noteSustainability ?? ''
    this.fileNameSustainability = data?.fileNameSustainability ?? ''
    this.originalFileNameSustainability =
      data?.originalFileNameSustainability ?? ''
    this.imageLibraryURL = data?.imageLibraryURL ?? ''
    this.noteLibrary = data?.noteLibrary ?? ''
    this.fileNameLibrary = data?.fileNameLibrary ?? ''
    this.originalFileNameLibrary = data?.originalFileNameLibrary ?? ''
    this.imageCertificationsURL = data?.imageCertificationsURL ?? ''
    this.noteCertifications = data?.noteCertifications ?? ''
    this.fileNameCertifications = data?.fileNameCertifications ?? ''
    this.originalFileNameCertifications =
      data?.originalFileNameCertifications ?? ''
    this.imageOfficeURL = data?.imageOfficeURL ?? ''
    this.noteOffice = data?.noteOffice ?? ''
    this.fileNameOffice = data?.fileNameOffice ?? ''
    this.originalFileNameOffice = data?.originalFileNameOffice ?? ''
  }
}
