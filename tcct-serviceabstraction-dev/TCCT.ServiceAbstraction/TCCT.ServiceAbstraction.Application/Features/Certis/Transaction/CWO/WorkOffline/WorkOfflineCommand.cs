using TCCT.ServiceAbstraction.Application.Configuration.Commands;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CWO.WorkOffline;
public class WorkOfflineCommand : ICommand<WorkOfflineResult>
{
	public int CwoId { get; set; }
	public Guid WorkOfflineBy { get; set; }
	public string Reason { get; set; } = null!;

	public WorkOfflineCommand(WorkOfflineRequest request)
	{
		CwoId = request.CwoId;
		Reason = request.Reason;
		WorkOfflineBy = request.WorkOfflineBy;
	}
}
