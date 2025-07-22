namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CWO.WorkOffline;
public class WorkOfflineRequest
{
	public int CwoId { get; set; }
	public Guid WorkOfflineBy { get; set; }
	public string Reason { get; set; } = null!;

	public WorkOfflineRequest()
	{

	}

	public WorkOfflineRequest(int cwoId, Guid workOfflineBy, string reason)
	{
		CwoId = cwoId;
		WorkOfflineBy = workOfflineBy;
		Reason = reason;
	}
}
