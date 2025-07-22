namespace TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Command.UpdateParcelReadStatus;
public class UpdateParcelReadStatusResult
{
	public UpdateParcelReadStatusData data { get; set; } = new UpdateParcelReadStatusData();
}

public class UpdateParcelReadStatusData
{
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
	public bool isActive { get; set; }
	public string? storageLocationId { get; set; }
	public bool moderationStatus { get; set; }
	public string? createdAt { get; set; }
	public string? updatedAt { get; set; }
	public string? createdBy { get; set; }
	public string? updatedBy { get; set; }
	public bool readStatus { get; set; }
}
