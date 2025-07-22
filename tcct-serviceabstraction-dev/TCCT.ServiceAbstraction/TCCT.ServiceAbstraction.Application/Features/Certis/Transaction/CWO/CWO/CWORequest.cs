namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CWO.CWO;
public class CWORequest
{
	public DateTime RequestedOn { get; set; }
	public int PriorityId { get; set; }
	public int RequesterId { get; set; }
	public int LocationId { get; set; }
	public int AssetId { get; set; } = 0;
	public int CwoTypeId { get; set; }
	public int ServiceCategoryId { get; set; }
	public int ProblemTypeId { get; set; }
	public Guid CreatedBy { get; set; }
	public string Description { get; set; } = string.Empty;

	public CWORequest()
	{
		RequestedOn = new DateTime();
		PriorityId = 0;
		RequesterId = 0;
		LocationId = 0;
		AssetId = 0;
		Description = "";
		CreatedBy = new Guid();
		CwoTypeId = 0;
		ServiceCategoryId = 0;
		ProblemTypeId = 0;
	}
	public CWORequest(DateTime requestedOn, int priorityId, int requesterId, int locationId, int assetId, int cwoTypeId, int serviceCategoryId, int problemTypeId, Guid createdBy, string description)
	{
		RequestedOn = requestedOn;
		PriorityId = priorityId;
		RequesterId = requesterId;
		LocationId = locationId;
		AssetId = assetId;
		Description = description;
		CreatedBy = createdBy;
		CwoTypeId = cwoTypeId;
		ServiceCategoryId = serviceCategoryId;
		ProblemTypeId = problemTypeId;
	}
}
