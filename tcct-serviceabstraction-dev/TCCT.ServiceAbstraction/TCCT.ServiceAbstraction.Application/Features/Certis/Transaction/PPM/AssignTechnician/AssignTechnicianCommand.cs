using TCCT.ServiceAbstraction.Application.Configuration.Commands;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.PPM.AssignTechnician;
public class AssignTechnicianCommand : ICommand<AssignTechnicianResult>
{
	public int WoId { get; set; }
	public string TechnicianIds { get; set; } = null!;
	public Guid AssignedBy { get; set; }

	public AssignTechnicianCommand(AssignTechnicianRequest request)
	{
		WoId = request.WorkOrderId;
		AssignedBy = request.AssignedBy;
		TechnicianIds = request.TechnicianIds;
	}
}
