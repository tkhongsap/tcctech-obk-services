using TCCT.ServiceAbstraction.Application.Configuration.Commands;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.PPM.SupervisorReject;
public class SupervisorRejectCommand : ICommand<SupervisorRejectResult>
{
	public int WoId { get; set; }
	public Guid RejectedBy { get; set; }

	public SupervisorRejectCommand(SupervisorRejectRequest request)
	{
		WoId = request.WorkOrderId;
		RejectedBy = request.RejectedBy;
	}
}
