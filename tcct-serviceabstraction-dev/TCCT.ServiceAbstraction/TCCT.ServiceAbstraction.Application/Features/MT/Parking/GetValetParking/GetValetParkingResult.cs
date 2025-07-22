using System;

namespace TCCT.ServiceAbstraction.Application.Features.MT.Parking.GetValetParking;

public class GetValetParkingResult
{
    public Pagination pagination{ get; set; }
    public List<ValetParkingInfo>? entities { get; set; }
}

public class Pagination
{
    public int? total { get; set; }
    public int? page { get; set; }
    public int? page_size { get; set; }
    public int? page_count { get; set; }
}

public class ValetParkingInfo
{
    public int? id { get; set; }
    public string? createdAt { get; set; }
    public string? updatedAt { get; set; }
    public string? deletedAt { get; set; }
    public string? code { get; set; }
    public string? status { get; set; }
    public string? name { get; set; }
    public string? phoneNumber { get; set; }
    public string? incomingTime { get; set; }
    public string? outgoingTime { get; set; }
    public string? licensePlate { get; set; }
    public string? licensePlateProvince { get; set; }
    public int? keyCabinetId { get; set; }
    public int? staffParkedId { get; set; }
    public int? staffDeliverId { get; set; }
    public int? userId { get; set; }
    public int? parkingSpotId { get; set; }
    public int? pickUpStationId { get; set; }
    public int? dropOffStationId { get; set; }
    public string? verifiedAt { get; set; }
    public int? staffVerifyId { get; set; }
    public string? confirmParkedAt { get; set; }
    public int? staffConfirmParkedId { get; set; }
    public string? confirmDeliverAt { get; set; }
    public int? staffConfirmDeliverId { get; set; }
    public string? signatureURL { get; set; }
    public string? referenceCode { get; set; }
    public bool? isMyQr { get; set; }
    public dynamic? spot { get; set; }
    public dynamic? staffDeliver { get; set; }
    public dynamic? staffParked { get; set; }
    public dynamic? staffConfirmDeliver { get; set; }
    public dynamic? staffConfirmParked { get; set; }
    public dynamic? staffVerify { get; set; }
    public dynamic? pickUpStation { get; set; }
    public dynamic? dropOffStation { get; set; }
    public dynamic? images { get; set; }
    public dynamic? keyCabinet { get; set; }
}