namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CWO.SupervisorReject;
public class SupervisorRejectRequest
{
	public int CwoId { get; set; }
	public Guid RejectedBy { get; set; }
	public int LocationId { get; set; }
	public string Description { get; set; }
	public int RequesterId { get; set; }
	public int AssetId { get; set; }

	public SupervisorRejectRequest()
	{
		CwoId = 0;
		RejectedBy = new Guid();
		LocationId = 0;
		Description = string.Empty;
		RequesterId = 0;
		AssetId = 0;
	}

	public SupervisorRejectRequest(int cwoId, Guid rejectedBy, int locationId, string description, int requesterId, int assetId)
	{
		CwoId = cwoId;
		RejectedBy = rejectedBy;
		LocationId = locationId;
		Description = description;
		RequesterId = requesterId;
		AssetId = assetId;
	}

}
