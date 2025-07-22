export interface IUpsertEmergencyContact {
  title: string
  titleTh: string
  titleZh: string
  descriptionTh: string
  descriptionEn: string
  descriptionZh: string
  phoneNumber: string
}

export interface IGetEmergencyContact {
  title: string
  titleTh: string
  titleZh: string
  descriptionTh: string
  descriptionEn: string
  descriptionZh: string
  phoneNumber: string
  updatedDate: string
  updatedBy: string
}

export interface IGetEmergencyContactRecord {
  data: IGetEmergencyContact
}
export class UpsertEmergencyContactData implements IUpsertEmergencyContact {
  title: string
  titleTh: string
  titleZh: string
  descriptionTh: string
  descriptionEn: string
  descriptionZh: string
  phoneNumber: string

  constructor(data?: IUpsertEmergencyContact) {
    this.title = data?.title ?? ''
    this.titleTh = data?.titleTh ?? ''
    this.titleZh = data?.titleZh ?? ''
    this.descriptionTh = data?.descriptionTh ?? ''
    this.descriptionEn = data?.descriptionEn ?? ''
    this.descriptionZh = data?.descriptionZh ?? ''
    this.phoneNumber = data?.phoneNumber ?? ''
  }
}
