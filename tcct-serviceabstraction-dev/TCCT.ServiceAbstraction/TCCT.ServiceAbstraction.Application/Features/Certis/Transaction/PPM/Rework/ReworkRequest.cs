namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.PPM.Rework;
public class ReworkRequest
{
	public int WorkOrderId { get; set; }
	public string ReasonToRework { get; set; } = null!;
	public Guid ReworkRequestedBy { get; set; }

	public ReworkRequest()
	{

	}

	public ReworkRequest(int workOrderId, string reasonToRework, Guid reworkRequestedBy)
	{
		WorkOrderId = workOrderId;
		ReasonToRework = reasonToRework;
		ReworkRequestedBy = reworkRequestedBy;
	}
}
