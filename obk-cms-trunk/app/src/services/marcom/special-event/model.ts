export interface IEventUpload {
  fileContentBase64: string | ArrayBuffer | null
  fileName: string
  contentType: string
}

export interface IEventData {
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
}

export class EventData implements IEventData {
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

  constructor(data?: IEventData) {
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
  }
}
