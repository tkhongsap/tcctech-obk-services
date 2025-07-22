export interface IHomeContentList {
  hcid: number
  version: string
  lastupdate: string
  updateby: string
}

export interface ILastVersion {
  version?: number
  updatedDate?: Date
  updatedBy: string
  updatedDateDisplay: string
}

export interface IHomeContentUpload {
  fileContentBase64: string | ArrayBuffer | null
  fileName: string
  contentType: string
}

export interface IHomeContentData {
  imageURL: string
  visible: 0 | 1
  isVisible?: boolean
  note: string
  message: string
  fileName: string
  originalFileName: string
  updatedByName?: string
  updatedDateDisplay?: string
}

export class HomeContentData implements IHomeContentData {
  imageURL: string
  visible: 0 | 1
  note: string
  message: string
  fileName: string
  originalFileName: string
  imageFile?: File

  constructor(data?: IHomeContentData) {
    this.imageURL = data?.imageURL ?? ''
    this.visible = data?.isVisible === undefined ? 1 : 0
    this.note = data?.note ?? ''
    this.message = data?.message ?? ''
    this.fileName = data?.fileName ?? ''
    this.originalFileName = data?.originalFileName ?? ''
  }
}
