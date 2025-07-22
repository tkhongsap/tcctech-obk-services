using System;

namespace TCCT.ServiceAbstraction.Application.Features.FinedayResidence.Carpark.GetParkingDetailByQRCode;

public class GetParkingDetailByQRCodeResult
{
    public string logId { get; set; }
    public string ticketNo { get; set; }
    public string ticketUid { get; set; }
    public string plateNo { get; set; }
    public int exitStatus { get; set; }
    public int terminalInId { get; set; }
    public string terminalInName { get; set; }
    public int memberTypeId { get; set; }
    public string memberTypeName { get; set; }
    public int vehicleTypeId { get; set; }
    public string vehicleTypeName { get; set; }
    public string entryDateTime { get; set; }
    public string logDateTime { get; set; }
    public bool isCardLost { get; set; }
    public int parkHH { get; set; }
    public int parkMM { get; set; }
    public int rateHH { get; set; }
    public int freeHH { get; set; }
    public string rateCode { get; set; }
    public string rateDetailTH { get; set; }
    public string rateDetailEN { get; set; }
    public string tenantId { get; set; }
    public string tenantName { get; set; }
    public int subTotal { get; set; }
    public int discount { get; set; }
    public int parkFee { get; set; }
    public int cardLostFine { get; set; }
    public int overNightFine { get; set; }
    public int total { get; set; }
    public bool isInv { get; set; }
    public int invRateHH { get; set; }
    public int invFee { get; set; }
    public bool isPayAtKiosk { get; set; }
    public string lastDateTimePaymentAtKiosk { get; set; }
    public int payAtKioskAll { get; set; }
    public int timeUsedInMinute { get; set; }
    public int durationInMinute { get; set; }
    public int remainInMinute { get; set; }
    public int userId { get; set; }
}
