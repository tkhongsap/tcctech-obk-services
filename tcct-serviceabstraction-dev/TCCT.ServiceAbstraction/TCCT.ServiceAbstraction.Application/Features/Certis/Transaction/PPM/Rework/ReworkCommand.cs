using TCCT.ServiceAbstraction.Application.Configuration.Commands;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.PPM.Rework;
public class ReworkCommand : ICommand<ReworkResult>
{
	public int WoId { get; set; }
	public string ReasonToRework { get; set; } = null!;
	public Guid ReworkRequestedBy { get; set; }

	public ReworkCommand(ReworkRequest request)
	{
		WoId = request.WorkOrderId;
		ReasonToRework = request.ReasonToRework;
		ReworkRequestedBy = request.ReworkRequestedBy;
	}
}

