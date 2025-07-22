using TCCT.ServiceAbstraction.Application.Configuration.Commands;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CWO.AssignSupervisor;
public class AssignSupervisorCommand : ICommand<AssignSupervisorResult>
{
	public int CwoId { get; set; }
	public Guid SupervisorId { get; set; } = new Guid();
	public Guid AssignedBy { get; set; } = new Guid();
	public int LocationId { get; set; }
	public string Description { get; set; } = null!;
	public int RequesterId { get; set; }
	public int Asset { get; set; }

	public AssignSupervisorCommand(AssignSupervisorRequest request)
	{
		CwoId = request.CwoId;
		SupervisorId = request.SupervisorId;
		AssignedBy = request.AssignedBy;
		LocationId = request.LocationId;
		Description = request.Description;
		RequesterId = request.RequesterId;
		Asset = request.Asset;
	}
}
