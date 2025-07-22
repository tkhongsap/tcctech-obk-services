namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.PPM.TechnicianReject;
public class TechnicianRejectRequest
{
	public int WorkOrderId { get; set; }
	public Guid RejectedBy { get; set; }
	public Guid TechnicianId { get; set; }


	public TechnicianRejectRequest()
	{

	}

	public TechnicianRejectRequest(int workOrderId, Guid rejectedBy, Guid technicianId)
	{
		WorkOrderId = workOrderId;
		RejectedBy = rejectedBy;
		TechnicianId = technicianId;
	}
}
