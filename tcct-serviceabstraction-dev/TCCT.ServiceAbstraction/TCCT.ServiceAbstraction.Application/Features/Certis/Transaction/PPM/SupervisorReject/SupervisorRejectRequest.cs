namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.PPM.SupervisorReject;
public class SupervisorRejectRequest
{
	public int WorkOrderId { get; set; }
	public Guid RejectedBy { get; set; }

	public SupervisorRejectRequest()
	{

	}

	public SupervisorRejectRequest(int workOrderId, Guid rejectedBy)
	{
		WorkOrderId = workOrderId;
		RejectedBy = rejectedBy;
	}
}
