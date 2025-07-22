export interface TResidenceMember {
    personID: string;
    firstname: string;
    lastname: string;
    gender: string;
    idcard: string;
    passport: string;
    note: string;
    active: boolean;
    serviceType: ServiceType[];
    residentIDList: ResidentIDList[];
    cardResidenceList: CardResidenceList[];
    emailList: EmailList[];
    phoneList: PhoneList[];
    imageList: ImageList[];
    authorizeFloorList: any[];
    cardCarParkList: any[];
    canPreRegister: boolean;
    canRedemption: boolean;
    redemptionData: RedemptionData;
}

interface RedemptionData {
    userId: number;
    active: boolean;
}

interface ImageList {
    base64: string;
    isDefault: boolean;
    name: string;
}

interface PhoneList {
    id: number;
    country: string;
    code: string;
    phoneNumber: string;
    isDefault: boolean;
    active: boolean;
}

interface EmailList {
    id: number;
    email: string;
    isDefault: boolean;
    active: boolean;
}

interface CardResidenceList {
    cardNumber: string;
    startDate: null;
    endDate: null;
    residenceId: number;
}

interface ResidentIDList {
    residenceID: number;
    active: boolean;
}

interface ServiceType {
    serviceTypeID: number;
    serviceTypeName: string;
    active: boolean;
}