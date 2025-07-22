namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CWO.AssignSupervisor;
public class AssignSupervisorRequest
{
	public int CwoId { get; set; }
	public Guid SupervisorId { get; set; } = new Guid();
	public Guid AssignedBy { get; set; } = new Guid();
	public int LocationId { get; set; }
	public string Description { get; set; } = null!;
	public int RequesterId { get; set; }
	public int Asset { get; set; }

	public AssignSupervisorRequest()
	{
		CwoId = 0;
		SupervisorId = new Guid();
		AssignedBy = new Guid();
		LocationId = 0;
		Description = "";
		RequesterId = 0;
		Asset = 0;
	}

	public AssignSupervisorRequest(int cwoId, Guid supervisorId, Guid assignedBy, int locationId, string description, int requesterId, int asset)
	{
		CwoId = cwoId;
		SupervisorId = supervisorId;
		AssignedBy = assignedBy;
		LocationId = locationId;
		Description = description;
		RequesterId = requesterId;
		Asset = asset;
	}
}
