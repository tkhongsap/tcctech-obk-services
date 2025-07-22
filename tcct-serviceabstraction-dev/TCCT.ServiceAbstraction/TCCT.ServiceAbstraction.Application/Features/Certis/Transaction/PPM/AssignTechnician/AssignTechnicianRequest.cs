namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.PPM.AssignTechnician;
public class AssignTechnicianRequest
{
	public int WorkOrderId { get; set; }
	public string TechnicianIds { get; set; }
	public Guid AssignedBy { get; set; }

	public AssignTechnicianRequest()
	{

	}

	public AssignTechnicianRequest(int workOrderId, string technicianIds, Guid assignedBy)
	{
		WorkOrderId = workOrderId;
		TechnicianIds = technicianIds;
		AssignedBy = assignedBy;
	}
}
