import { Controller, Route, Get, SuccessResponse, OperationId } from "tsoa";
import packageInfo from '../../package.json'
import OCRClient from '../libs/ocr_client';
import TCCClient from '../libs/tcc_client';
import FSParkingClient from '../libs/fs_parking_client';
import BmsClient from '../libs/bms_client';
import IAMClient from '../libs/iam_client';

// For testing
// import { ReceiptData, ReceiptDataErrorResponse } from '../libs/ocr_client';
// import { OcrService } from "../services/ocr_service";
// import ReceiptRepository from '../repositories/receipts_repository';
// import ParkingDetailsRepository from '../repositories/parking_details_repository';

@Route("health")
export class HealthController extends Controller {
  @Get("")
  @SuccessResponse(200)
  @OperationId("health")
  public async health() {
    // version
    const appVersion = packageInfo.version;
    const ENABLE_OCR_WORKER = process.env.ENABLE_OCR_WORKER || ''
    const CACHE_REDIS = process.env.CACHE_REDIS || ''
    const CACHE_REDIS_URL = process.env.CACHE_REDIS_URL || ''
    const OB_BMS_URL = process.env.OB_BMS_URL || ''
    const TCC_API_URL = process.env.TCC_API_URL || ''
    const OB_PARKING_URL = process.env.OB_PARKING_URL || ''
    const REDEEMER_ID = process.env.REDEEMER_ID || ''
    const OCR_API_URL = process.env.OCR_API_URL || ''
    const OB_IAM_URL = process.env.OB_IAM_URL || ''
    let TCC_CLIENT_ID = process.env.TCC_CLIENT_ID || ''
    let TCC_CLIENT_SECRET = process.env.TCC_CLIENT_SECRET || ''
    let FS_PARKING_API_URL = (process.env.FS_PARKING_API_URL || '')
    let FS_PARKING_API_KEY = (process.env.FS_PARKING_API_KEY || '')
     if (TCC_CLIENT_ID.length > 3) {
      TCC_CLIENT_ID = TCC_CLIENT_ID.substring(0, 2) + "**************" + TCC_CLIENT_ID.slice(-2)
    }

    if (TCC_CLIENT_SECRET.length > 3) {
      TCC_CLIENT_SECRET = TCC_CLIENT_SECRET.substring(0, 2) + "**************" + TCC_CLIENT_SECRET.slice(-2)
    }

    if (FS_PARKING_API_KEY.length > 3) {
      FS_PARKING_API_KEY = FS_PARKING_API_KEY.substring(0, 2) + "**************" + FS_PARKING_API_URL.slice(-2)
    }

    let ocrSetviceStatus = { status: 0, message: 'checking'}
    try {
      const ocrClientHealth = await OCRClient.health()
      ocrSetviceStatus = { status: ocrClientHealth.status, message: ocrClientHealth.data }
    } catch (e: any) {
      ocrSetviceStatus = { status: e?.response?.status, message: e?.response?.data}
    }

    let tccSetviceStatus = { status: 0, message: 'checking'}
    try {
      const tccClientHealth = await TCCClient.health()
      tccSetviceStatus = { status: tccClientHealth.status, message: tccClientHealth.data }
    } catch (e: any) {
      tccSetviceStatus = { status: e?.response?.status, message: e?.response?.data}
    }

    let fsSetviceStatus = { status: 0, message: 'checking'}
    try {
      const fsParkingClientHealth = await FSParkingClient.health()
      fsSetviceStatus = { status: fsParkingClientHealth.status, message: fsParkingClientHealth.data }
    } catch (e: any) {
      fsSetviceStatus = { status: e?.response?.status, message: e?.response?.data}
    }

    let bmsSetviceStatus = { status: 0, message: 'checking'}
    try {
      const bmsClientHealth = await BmsClient.health()
      bmsSetviceStatus = { status: bmsClientHealth.status, message: bmsClientHealth.data }
    } catch (e: any) {
      bmsSetviceStatus = { status: e?.response?.status, message: e?.response?.data}
    }
    
    let iamSetviceStatus = { status: 0, message: 'checking'}
    try {
      const iamClientHealth = await IAMClient.health()
      iamSetviceStatus = { status: iamClientHealth.status, message: iamClientHealth.data }
    } catch (e: any) {
      iamSetviceStatus = { status: e?.response?.status, message: e?.response?.data}
    }

    return {
      appVersion,
      ENABLE_OCR_WORKER,
      CACHE_REDIS,
      CACHE_REDIS_URL,
      OB_BMS_URL,
      TCC_API_URL,
      OB_PARKING_URL,
      REDEEMER_ID,
      OCR_API_URL,
      OB_IAM_URL,
      TCC_CLIENT_ID,
      TCC_CLIENT_SECRET,
      FS_PARKING_API_KEY,
      tccSetviceStatus,
      ocrSetviceStatus,
      fsSetviceStatus,
      bmsSetviceStatus,
      iamSetviceStatus
    }

    // const parkingDetails = await ParkingDetailsRepository.findMany();
    // console.log("===== parking detail ======", parkingDetails)
    // const ocrService = new OcrService();
    // try {
    //   const createdParkingDetail = await ParkingDetailsRepository.create({
    //     data: {
    //       uid: '202506181355502201',
    //       meta: "[{\"status\":\"Success\",\"message\":\"คำนวณเรียบร้อยแล้ว\",\"exeption\":null,\"logId\":\"202506181355502201\",\"ticketNo\":\"dffbad38-6745-4906-917f-7d3440fea132\",\"ticketUid\":\"dffbad38-6745-4906-917f-7d3440fea132\",\"plateNo\":\"กฟ4321\",\"exitStatus\":0,\"terminalInId\":1,\"terminalInName\":\"\",\"memberTypeId\":0,\"memberTypeName\":\"VISITOR\",\"vehicleTypeId\":0,\"vehicleTypeName\":\"Car\",\"entryDateTime\":\"2025-06-18 07:39:42\",\"logDateTime\":\"2025-06-18 13:57:01\",\"isCardLost\":false,\"parkHH\":6,\"parkMM\":17,\"rateHH\":7,\"freeHH\":1,\"rateCode\":\"0\",\"rateDetailTH\":\"คิดชั่วโมงละ 100 บาท (1 ชั่วโมงแรกฟรี)\",\"rateDetailEN\":\"100 Baht Per Hour (Free 1 Hrs)\",\"tenantId\":\"1\",\"tenantName\":\"\",\"subTotal\":600,\"discount\":0,\"parkFee\":600,\"cardLostFine\":0,\"overNightFine\":0,\"total\":600,\"isInv\":false,\"invRateHH\":0,\"invFee\":0,\"isPayAtKiosk\":false,\"lastDateTimePaymentAtKiosk\":\"\",\"payAtKioskAll\":0,\"timeUsedInMinute\":0,\"durationInMinute\":0,\"remainInMinute\":0}]",
    //       account_id: null,
    //       email: null,
    //       phone: null,
    //       username: null,
    //       status: 'ACTIVE',
    //       plate_no: "กฟ4321",
    //       created_at: new Date(),
    //       updated_at: new Date(),
    //     },
    //   });
    //   const receipt = await ReceiptRepository.create({
    //         data: {
    //           parking_detail: {
    //             connect: {
    //               // id: createdParkingDetail.id,
    //               id: '803c7543-621a-4077-9d74-40854a4f9200'
    //             },
    //           },
    //           uid: '',
    //           image_url: 'https://i.ibb.co/B2TM7Rw5/010625-275-Ineligible-The-House-Basserie-Victor-Lee-1.jpg',
    //           status: 'PENDING',
    //           created_by: 'test1@test.com',
    //           updated_by: 'test1@test.com',
    //         },
    //       });
    // } catch (err) {
    //   console.log("==== error ====", err)
    // }
  }
}
