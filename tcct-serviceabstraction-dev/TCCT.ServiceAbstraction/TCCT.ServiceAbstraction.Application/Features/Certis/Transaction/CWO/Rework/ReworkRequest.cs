namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CWO.Rework;
public class ReworkRequest
{
	public int CwoId { get; set; }
	public string ReasonToRework { get; set; } = string.Empty;
	public Guid ReworkRequestedBy { get; set; }

	public ReworkRequest()
	{

	}

	public ReworkRequest(int cwoId, string reasonToRework, Guid reworkRequestedBy)
	{
		CwoId = cwoId;
		ReasonToRework = reasonToRework;
		ReworkRequestedBy = reworkRequestedBy;
	}
}
