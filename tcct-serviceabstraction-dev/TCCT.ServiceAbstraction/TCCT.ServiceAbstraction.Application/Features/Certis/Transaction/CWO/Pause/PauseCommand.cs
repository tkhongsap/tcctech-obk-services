using TCCT.ServiceAbstraction.Application.Configuration.Commands;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CWO.Pause;
public class PauseCommand : ICommand<PauseResult>
{
	public int CwoId { get; set; }
	public Guid PausedBy { get; set; }
	public string Reason { get; set; } = null!;

	public PauseCommand(PauseRequest body)
	{
		CwoId = body.CwoId;
		PausedBy = body.PausedBy;
		Reason = body.Reason;
	}
}
