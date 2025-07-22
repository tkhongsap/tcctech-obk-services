using TCCT.ServiceAbstraction.Application.Configuration.Commands;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CWO.SupervisorReject;
public class SupervisorRejectCommand : ICommand<SupervisorRejectResult>
{
	public int CwoId { get; set; }
	public Guid RejectedBy { get; set; }
	public int LocationId { get; set; }
	public string Description { get; set; } = string.Empty;
	public int RequesterId { get; set; }
	public int AssetId { get; set; }

	public SupervisorRejectCommand(SupervisorRejectRequest supervisorRejectCommand)
	{
		CwoId = supervisorRejectCommand.CwoId;
		RejectedBy = supervisorRejectCommand.RejectedBy;
		LocationId = supervisorRejectCommand.LocationId;
		Description = supervisorRejectCommand.Description;
		RequesterId = supervisorRejectCommand.RequesterId;
		AssetId = supervisorRejectCommand.AssetId;
	}
}


