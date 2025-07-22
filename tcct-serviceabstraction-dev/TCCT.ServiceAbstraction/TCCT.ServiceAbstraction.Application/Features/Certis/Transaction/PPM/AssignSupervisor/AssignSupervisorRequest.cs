namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.PPM.AssignSupervisor;
public class AssignSupervisorRequest
{
	public int WorkOrderId { get; set; }
	public Guid SupervisorId { get; set; }
	public Guid AssignedBy { get; set; }

	public AssignSupervisorRequest()
	{

	}

	public AssignSupervisorRequest(int workOrderId, Guid supervisorId, Guid assignedBy)
	{
		WorkOrderId = workOrderId;
		SupervisorId = supervisorId;
		AssignedBy = assignedBy;
	}
}
