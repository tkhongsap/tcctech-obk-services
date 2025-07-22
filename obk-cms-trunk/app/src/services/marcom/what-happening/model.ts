export interface IHappeningUpload {
  fileContentBase64: string | ArrayBuffer | null
  fileName: string
  contentType: string
}

export interface IHappeningData {
  imageURL: string
  message: string
  fileName: string
  originalFileName: string

  imageenURL: string
  noteen: string
  fileNameen: string
  originalFileNameen: string
  imagethURL: string
  noteth: string
  fileNameth: string
  originalFileNameth: string
  imagecnURL: string
  notecn: string
  fileNamecn: string
  originalFileNamecn: string
  updatedByName?: string
  updatedDateDisplay?: string

  imageenURLHeader: string
  noteenHeader: string
  fileNameenHeader: string
  originalFileNameenHeader: string
  imagethURLHeader: string
  notethHeader: string
  fileNamethHeader: string
  originalFileNamethHeader: string
  imagecnURLHeader: string
  notecnHeader: string
  fileNamecnHeader: string
  originalFileNamecnHeader: string
}

export class HappeningData implements IHappeningData {
  imageURL: string
  message: string
  fileName: string
  originalFileName: string
  imageFile?: File

  imageenURL: string
  noteen: string
  fileNameen: string
  originalFileNameen: string
  imagethURL: string
  noteth: string
  fileNameth: string
  originalFileNameth: string
  imagecnURL: string
  notecn: string
  fileNamecn: string
  originalFileNamecn: string

  imageenURLHeader: string
  noteenHeader: string
  fileNameenHeader: string
  originalFileNameenHeader: string
  imagethURLHeader: string
  notethHeader: string
  fileNamethHeader: string
  originalFileNamethHeader: string
  imagecnURLHeader: string
  notecnHeader: string
  fileNamecnHeader: string
  originalFileNamecnHeader: string

  constructor(data?: IHappeningData) {
    this.imageURL = data?.imageURL ?? ''
    this.message = data?.message ?? ''
    this.fileName = data?.fileName ?? ''
    this.originalFileName = data?.originalFileName ?? ''

    this.imageenURL = data?.imageenURL ?? ''
    this.noteen = data?.noteen ?? ''
    this.fileNameen = data?.fileNameen ?? ''
    this.originalFileNameen = data?.originalFileNameen ?? ''
    this.imagethURL = data?.imagethURL ?? ''
    this.noteth = data?.noteth ?? ''
    this.fileNameth = data?.fileNameth ?? ''
    this.originalFileNameth = data?.originalFileNameth ?? ''
    this.imagecnURL = data?.imagecnURL ?? ''
    this.notecn = data?.notecn ?? ''
    this.fileNamecn = data?.fileNamecn ?? ''
    this.originalFileNamecn = data?.originalFileNamecn ?? ''

    this.imageenURLHeader = data?.imageenURLHeader ?? ''
    this.noteenHeader = data?.noteenHeader ?? ''
    this.fileNameenHeader = data?.fileNameenHeader ?? ''
    this.originalFileNameenHeader = data?.originalFileNameenHeader ?? ''
    this.imagethURLHeader = data?.imagethURLHeader ?? ''
    this.notethHeader = data?.notethHeader ?? ''
    this.fileNamethHeader = data?.fileNamethHeader ?? ''
    this.originalFileNamethHeader = data?.originalFileNamethHeader ?? ''
    this.imagecnURLHeader = data?.imagecnURLHeader ?? ''
    this.notecnHeader = data?.notecnHeader ?? ''
    this.fileNamecnHeader = data?.fileNamecnHeader ?? ''
    this.originalFileNamecnHeader = data?.originalFileNamecnHeader ?? ''
  }
}
