namespace TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Query.GetParcels;

public class GetParcelsResult {
   public GetParcelsPaginateResponse paginate { get; set; } = new();
   public List<GetParcelsResultData> data { get; set; } = new();
}

public class GetParcelsResultData
{
   public string? id { get; set; }
   public string? orgId { get; set; }
   public string? companyId { get; set; }
   public string? trackingNumber { get; set; }
   public string? carrierId { get; set; }
   public string? parcelConditionId { get; set; }
   public string? parcelTypeId { get; set; }
   public ParcelStatus? parcelStatus { get; set; }
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
   public string? projectName { get; set; }
   public string? buildingName { get; set; }
   public string? unitNumber { get; set; }
   public string? recipientFirstName { get; set; }
   public string? recipientLastName { get; set; }
   public string? recipientEmail { get; set; }
   public string? senderFirstName { get; set; }
   public string? senderLastName { get; set; }
   public string? createdByName { get; set; }
   public ParcelCondition? parcelCondition { get; set; }
   public ParcelType? parcelType { get; set; }
   public Location? receivedLocation { get; set; }
   public Location? deliveredLocation { get; set; }
   public ReturnedTo? returnedTo { get; set; }
   public string? parcelPriorityName { get; set; }
}
public class ReturnedTo
{
   public int? id { get; set; }
   public int? orgId { get; set; }
   public string? code { get; set; }
   public string? name { get; set; }
   public string? mobileNo { get; set; }
   public string? website { get; set; }
   public string? address { get; set; }
   public bool? isActive { get; set; }
   public int? createdBy { get; set; }
   public long? createdAt { get; set; }
   public long? updatedAt { get; set; }
   public int? updatedBy { get; set; }
}
public class ParcelStatus
{
   public int? id { get; set; }
   public int? orgId { get; set; }
   public int? projectId { get; set; }
   public string? statusName { get; set; }
   public int? statusId { get; set; }
   public int? listOrder { get; set; }
   public bool? isDefault { get; set; }
}
public class ParcelCondition
{
   public int? id { get; set; }
   public string? parcelCondition { get; set; }
   public string? description { get; set; }
   public int? orgId { get; set; }
   public int? createdBy { get; set; }
   public long? createdAt { get; set; }
   public int? updatedBy { get; set; }
   public long? updatedAt { get; set; }
   public bool? isActive { get; set; }
   public int? listOrder { get; set; }
}

public class ParcelType
{
   public int? id { get; set; }
   public string? parcelType { get; set; }
   public string? description { get; set; }
   public int? orgId { get; set; }
   public int? createdBy { get; set; }
   public long? createdAt { get; set; }
   public int? updatedBy { get; set; }
   public long? updatedAt { get; set; }
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

public class Location
{
   public int? id { get; set; }
   public int? orgId { get; set; }
   public string? code { get; set; }
   public string? name { get; set; }
   public string? description { get; set; }
   public bool? isActive { get; set; }
   public int? createdBy { get; set; }
   public long? createdAt { get; set; }
   public int? updatedBy { get; set; }
   public long? updatedAt { get; set; }
}

public class GetParcelsPaginateResponse
{
    public int total { get; set; }
    public int limit { get; set; }
    public int count { get; set; }
    public int page { get; set; }
}