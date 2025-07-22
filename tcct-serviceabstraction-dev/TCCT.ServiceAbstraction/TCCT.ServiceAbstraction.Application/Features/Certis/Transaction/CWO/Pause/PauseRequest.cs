namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CWO.Pause;
public class PauseRequest
{
	public int CwoId { get; set; }
	public Guid PausedBy { get; set; }
	public string Reason { get; set; } = null!;

	public PauseRequest()
	{
		CwoId = 0;
		PausedBy = Guid.NewGuid();
		Reason = null!;
	}

	public PauseRequest(int cwoId, Guid pausedBy, string reason)
	{
		CwoId = cwoId;
		PausedBy = pausedBy;
		Reason = reason;
	}
}
