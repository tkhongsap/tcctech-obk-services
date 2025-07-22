using TCCT.ServiceAbstraction.Application.Configuration.Commands;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CWO.Resume;
public class ResumeCommand : ICommand<ResumeResult>
{
	public int CwoId { get; set; }
	public Guid ResumedBy { get; set; }

	public ResumeCommand(ResumeRequest body)
	{
		CwoId = body.CwoId;
		ResumedBy = body.ResumedBy;
	}
}
