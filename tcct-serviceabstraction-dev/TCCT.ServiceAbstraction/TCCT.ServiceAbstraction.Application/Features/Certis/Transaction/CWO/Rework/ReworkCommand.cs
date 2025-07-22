using TCCT.ServiceAbstraction.Application.Configuration.Commands;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CWO.Rework;
public class ReworkCommand : ICommand<ReworkResult>
{
	public int CwoId { get; set; }
	public string ReasonToRework { get; set; } = string.Empty;
	public Guid ReworkRequestedBy { get; set; }

	public ReworkCommand(ReworkRequest request)
	{
		CwoId = request.CwoId;
		ReasonToRework = request.ReasonToRework;
		ReworkRequestedBy = request.ReworkRequestedBy;
	}
}
