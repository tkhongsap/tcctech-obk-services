using TCCT.ServiceAbstraction.Application.Configuration.Commands;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.PPM.AssignSupervisor;
public class AssignSupervisorCommand : ICommand<AssignSupervisorResult>
{
	public int WoId { get; set; }
	public Guid SupervisorId { get; set; }
	public Guid AssignedBy { get; set; }

	public AssignSupervisorCommand(AssignSupervisorRequest request)
	{
		WoId = request.WorkOrderId;
		SupervisorId = request.SupervisorId;
		AssignedBy = request.AssignedBy;
	}
}
