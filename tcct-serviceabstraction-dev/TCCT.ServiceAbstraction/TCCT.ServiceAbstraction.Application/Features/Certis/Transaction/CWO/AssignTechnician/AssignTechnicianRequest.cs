namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CWO.AssignTechnician;
public class AssignTechnicianRequest
{
	public int CwoId { get; set; }
	public Guid AssignedBy { get; set; }
	public Guid TechnicianId { get; set; }
	public string OperatorNote { get; set; } = null!;
	public int LocationId { get; set; }
	public string Description { get; set; } = null!;
	public int RequesterId { get; set; }
	public int AssetId { get; set; }

	public AssignTechnicianRequest()
	{
		CwoId = 0;
		AssignedBy = new Guid();
		TechnicianId = new Guid();
		OperatorNote = "";
		LocationId = 0;
		Description = "";
		RequesterId = 0;
		AssetId = 0;
	}

	public AssignTechnicianRequest(int cwoId, Guid assignedBy, Guid technicianId, string operatorNote, int locationId, string description, int requesterId, int assetId)
	{
		CwoId = cwoId;
		AssignedBy = assignedBy;
		TechnicianId = technicianId;
		OperatorNote = operatorNote;
		LocationId = locationId;
		Description = description;
		RequesterId = requesterId;
		AssetId = assetId;
	}
}
