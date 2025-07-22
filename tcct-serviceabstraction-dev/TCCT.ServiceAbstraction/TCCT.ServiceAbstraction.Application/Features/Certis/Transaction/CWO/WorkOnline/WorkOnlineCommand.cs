using TCCT.ServiceAbstraction.Application.Configuration.Commands;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CWO.WorkOnline;
public class WorkOnlineCommand : ICommand<WorkOnlineResult>
{
	public int CwoId { get; set; }
	public string ReactivatedBy { get; set; } = null!;
}
