namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CWO.Resume;
public class ResumeRequest
{
	public int CwoId { get; set; }
	public Guid ResumedBy { get; set; }

	public ResumeRequest()
	{
		CwoId = 0;
		ResumedBy = new Guid();
	}

	public ResumeRequest(int cwoId, Guid resumedBy)
	{
		CwoId = cwoId;
		ResumedBy = resumedBy;
	}
}
