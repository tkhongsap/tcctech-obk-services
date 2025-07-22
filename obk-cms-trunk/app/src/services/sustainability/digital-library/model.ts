export interface ILibraryUpload {
  fileContentBase64: string | ArrayBuffer | null
  fileName: string
  contentType: string
}

export interface IDigitalLibraryData {
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

  imageenURLAttach: string
  noteenAttach: string
  fileNameenAttach: string
  originalFileNameenAttach: string
  imagethURLAttach: string
  notethAttach: string
  fileNamethAttach: string
  originalFileNamethAttach: string
  imagecnURLAttach: string
  notecnAttach: string
  fileNamecnAttach: string
  originalFileNamecnAttach: string
}

export class DigitalLibraryData implements IDigitalLibraryData {
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

  imageenURLAttach: string
  noteenAttach: string
  fileNameenAttach: string
  originalFileNameenAttach: string
  imagethURLAttach: string
  notethAttach: string
  fileNamethAttach: string
  originalFileNamethAttach: string
  imagecnURLAttach: string
  notecnAttach: string
  fileNamecnAttach: string
  originalFileNamecnAttach: string

  constructor(data?: IDigitalLibraryData) {
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

    this.imageenURLAttach = data?.imageenURLAttach ?? ''
    this.noteenAttach = data?.noteenAttach ?? ''
    this.fileNameenAttach = data?.fileNameenAttach ?? ''
    this.originalFileNameenAttach = data?.originalFileNameenAttach ?? ''
    this.imagethURLAttach = data?.imagethURLAttach ?? ''
    this.notethAttach = data?.notethAttach ?? ''
    this.fileNamethAttach = data?.fileNamethAttach ?? ''
    this.originalFileNamethAttach = data?.originalFileNamethAttach ?? ''
    this.imagecnURLAttach = data?.imagecnURLAttach ?? ''
    this.notecnAttach = data?.notecnAttach ?? ''
    this.fileNamecnAttach = data?.fileNamecnAttach ?? ''
    this.originalFileNamecnAttach = data?.originalFileNamecnAttach ?? ''
  }
}
