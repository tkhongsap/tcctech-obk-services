namespace TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Query.GetTenantDetailsParcel;

public class GetTenantDetailsParcelResult {
    public GetTenantDetailsParcelResultData? data { get; set; }
}

public class GetTenantDetailsParcelResultData {
    public string? id { get; set; }
    public string? orgId { get; set; }
    public string? companyId { get; set; }
    public string? trackingNumber { get; set; }
    public string? carrierId { get; set; }
    public string? parcelConditionId { get; set; }
    public string? parcelTypeId { get; set; }
    public int? parcelStatus { get; set; }
    public int? parcelPriority { get; set; }
    public int? pickedUpType { get; set; }
    public string? description { get; set; }
    public string? receivedDate { get; set; }
    public string? receivedBy { get; set; }
    public string? pickedUpAt { get; set; }
    public string? qrCode { get; set; }
    public string? barcode { get; set; }
    public string? signature { get; set; }
    public string? parcelViewStatus { get; set; }
    public bool? isPendingForApproval { get; set; }
    public string? displayId { get; set; }
    public bool? isActive { get; set; }
    public string? storageLocationId { get; set; }
    public bool? moderationStatus { get; set; }
    public string? createdAt { get; set; }
    public string? updatedAt { get; set; }
    public string? createdBy { get; set; }
    public string? updatedBy { get; set; }
    public bool? readStatus { get; set; }
    public string? deliveryDate { get; set; }
    public string? arrivedOn { get; set; }
    public string? returnedOn { get; set; }
    public string? deliveryLocationId { get; set; }
    public string? returnedLocationId { get; set; }
    public string? cancelledOn { get; set; }
    public string? returnedToId { get; set; }
    public Receiver? receiver { get; set; }
    public Sender? sender { get; set; }
    public PropertyData? propertyData { get; set; }
    public ParcelStatusDetail? parcelStatusDetail { get; set; }
    public ReceivedLocation? receivedLocation { get; set; }
    public DeliveredLocation? deliveredLocation { get; set; }
    public ReturnedTo? returnedTo { get; set; }
    public Carrier? carrier { get; set; }
    public ParcelConditionDetail? parcelConditionDetail { get; set; }
    public ParcelTypeDetail? parcelTypeDetail { get; set; }
    public List<ParcelImage>? parcelImages { get; set; }
    public List<DeliveredImage>? deliveredImages { get; set; }
    public List<RejectImage>? rejectImages { get; set; }
    public List<ReturnImage>? returnImages { get; set; }
    public List<CancelImage>? cancelImages { get; set; }
    public ReturnRemark? returnRemark { get; set; }
}

public class Receiver {
    public string? id { get; set; }
    public string? orgId { get; set; }
    public string? companyId { get; set; }
    public string? projectId { get; set; }
    public string? buildingId { get; set; }
    public string? unitId { get; set; }
    public string? parcelId { get; set; }
    public string? tenantId { get; set; }
    public string? ownerId { get; set; }
    public string? residentId { get; set; }
    public string? firstName { get; set; }
    public string? lastName { get; set; }
    public string? email { get; set; }
    public string? phoneNo { get; set; }
    public string? address { get; set; }
}

public class Sender {
    public string? orgId { get; set; }
    public string? id { get; set; }
    public string? parcelId { get; set; }
    public string? firstName { get; set; }
    public string? lastName { get; set; }
    public string? email { get; set; }
    public string? phoneNo { get; set; }
    public string? address { get; set; }
}

public class PropertyData {
    public string? companyName { get; set; }
    public string? projectName { get; set; }
    public string? buildingName { get; set; }
    public string? buildingPhaseCode { get; set; }
    public string? unitNumber { get; set; }
}

public class ParcelStatusDetail {
    public string? id { get; set; }
    public string? orgId { get; set; }
    public string? projectId { get; set; }
    public string? statusName { get; set; }
    public int? statusId { get; set; }
    public int? listOrder { get; set; }
    public bool? isDefault { get; set; }
}

public class ReceivedLocation {
    public string? id { get; set; }
    public string? orgId { get; set; }
    public string? code { get; set; }
    public string? name { get; set; }
    public string? description { get; set; }
    public bool? isActive { get; set; }
    public string? createdBy { get; set; }
    public string? createdAt { get; set; }
    public string? updatedAt { get; set; }
    public string? updatedBy { get; set; }
}

public class DeliveredLocation {
    public string? id { get; set; }
    public string? orgId { get; set; }
    public string? code { get; set; }
    public string? name { get; set; }
    public string? description { get; set; }
    public bool? isActive { get; set; }
    public string? createdBy { get; set; }
    public string? createdAt { get; set; }
    public string? updatedAt { get; set; }
    public string? updatedBy { get; set; }
}


public class ReturnedTo {
    public string? id { get; set; }
    public string? orgId { get; set; }
    public string? code { get; set; }
    public string? name { get; set; }
    public string? mobileNo { get; set; }
    public string? website { get; set; }
    public string? address { get; set; }
    public bool? isActive { get; set; }
    public string? createdBy { get; set; }
    public string? createdAt { get; set; }
    public string? updatedAt { get; set; }
    public string? updatedBy { get; set; }
}

public class Carrier {
    public string? id { get; set; }
    public string? orgId { get; set; }
    public string? code { get; set; }
    public string? name { get; set; }
    public string? mobileNo { get; set; }
    public string? website { get; set; }
    public string? address { get; set; }
    public bool? isActive { get; set; }
    public string? createdBy { get; set; }
    public string? createdAt { get; set; }
    public string? updatedAt { get; set; }
    public string? updatedBy { get; set; }
}

public class ParcelConditionDetail {
    public string? id { get; set; }
    public string? parcelCondition { get; set; }
    public string? description { get; set; }
    public string? orgId { get; set; }
    public string? createdBy { get; set; }
    public string? createdAt { get; set; }
    public string? updatedAt { get; set; }
    public string? updatedBy { get; set; }
    public bool? isActive { get; set; }
    public string? listOrder { get; set; }
}

public class ParcelTypeDetail {
    public string? id { get; set; }
    public string? parcelType { get; set; }
    public string? description { get; set; }
    public string? orgId { get; set; }
    public string? createdBy { get; set; }
    public string? createdAt { get; set; }
    public string? updatedAt { get; set; }
    public string? updatedBy { get; set; }
    public bool? isActive { get; set; }
    public ParcelIcon icon { get; set; }
}

public class ParcelIcon
{
   public int? id { get; set; }
   public int? entityId { get; set; }
   public string? entityType { get; set; }
   public string? s3Url { get; set; }
   public string? title { get; set; }
   public string? name { get; set; }
   public long? createdAt { get; set; }
   public long? updatedAt { get; set; }
   public bool? isActive { get; set; }
   public int? orgId { get; set; }
   public string? s3Path { get; set; }
   public int? record_id { get; set; }
   public int? source_rid { get; set; }
   public string? refImageUrl { get; set; }
}

public class ParcelImage {
    public string? id { get; set; }
    public string? entityId { get; set; }
    public string? entityType { get; set; }
    public string? s3Url { get; set; }
    public string? title { get; set; }
    public string? name { get; set; }
    public string? createdAt { get; set; }
    public string? updatedAt { get; set; }
    public bool? isActive { get; set; }
    public string? orgId { get; set; }
    public string? s3Path { get; set; }
    public string? record_id { get; set; }
    public string? source_rid { get; set; }
    public string? plantLotId { get; set; }
    public string? workPlanScheduleLocationTaskId { get; set; }
    public string? refImageUrl { get; set; }
    public string? watermarkedImageS3Path { get; set; }
}

public class DeliveredImage {
    public string? id { get; set; }
    public string? entityId { get; set; }
    public string? entityType { get; set; }
    public string? s3Url { get; set; }
    public string? title { get; set; }
    public string? name { get; set; }
    public string? createdAt { get; set; }
    public string? updatedAt { get; set; }
    public bool? isActive { get; set; }
    public string? orgId { get; set; }
    public string? s3Path { get; set; }
    public string? record_id { get; set; }
    public string? source_rid { get; set; }
    public string? plantLotId { get; set; }
    public string? workPlanScheduleLocationTaskId { get; set; }
    public string? refImageUrl { get; set; }
    public string? watermarkedImageS3Path { get; set; }
}

public class RejectImage {
    public string? id { get; set; }
    public string? entityId { get; set; }
    public string? entityType { get; set; }
    public string? s3Url { get; set; }
    public string? title { get; set; }
    public string? name { get; set; }
    public string? createdAt { get; set; }
    public string? updatedAt { get; set; }
    public bool? isActive { get; set; }
    public string? orgId { get; set; }
    public string? s3Path { get; set; }
    public string? record_id { get; set; }
    public string? source_rid { get; set; }
    public string? plantLotId { get; set; }
    public string? workPlanScheduleLocationTaskId { get; set; }
    public string? refImageUrl { get; set; }
    public string? watermarkedImageS3Path { get; set; }
}


public class ReturnImage {
    public string? id { get; set; }
    public string? entityId { get; set; }
    public string? entityType { get; set; }
    public string? s3Url { get; set; }
    public string? title { get; set; }
    public string? name { get; set; }
    public string? createdAt { get; set; }
    public string? updatedAt { get; set; }
    public bool? isActive { get; set; }
    public string? orgId { get; set; }
    public string? s3Path { get; set; }
    public string? record_id { get; set; }
    public string? source_rid { get; set; }
    public string? plantLotId { get; set; }
    public string? workPlanScheduleLocationTaskId { get; set; }
    public string? refImageUrl { get; set; }
    public string? watermarkedImageS3Path { get; set; }
}

public class CancelImage
{
    public string? id { get; set; }
    public string? entityId { get; set; }
    public string? entityType { get; set; }
    public string? s3Url { get; set; }
    public string? title { get; set; }
    public string? name { get; set; }
    public string? createdAt { get; set; }
    public string? updatedAt { get; set; }
    public bool? isActive { get; set; }
    public string? orgId { get; set; }
    public string? s3Path { get; set; }
    public string? record_id { get; set; }
    public string? source_rid { get; set; }
    public string? plantLotId { get; set; }
    public string? workPlanScheduleLocationTaskId { get; set; }
    public string? refImageUrl { get; set; }
    public string? watermarkedImageS3Path { get; set; }
}

public class ReturnRemark
{
    public string? id { get; set; }
    public string? parcelId { get; set; }
    public int? eventType { get; set; }
    public string? eventAt { get; set; }
    public string? eventBy { get; set; }
    public string? signature { get; set; }
    public string? remark { get; set; }
    public string? orgId { get; set; }
}

