namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.PPM.AcknowledgeAssignment;
public class AcknowledgeAssignmentRequest
{
	public int WorkOrderId { get; set; }
	public Guid AckedBy { get; set; }
	public string AcknowledgementSignature { get; set; } = null!;

	public AcknowledgeAssignmentRequest()
	{

	}

	public AcknowledgeAssignmentRequest(int workOrderId, Guid ackedBy, string acknowledgementSignature)
	{
		WorkOrderId = workOrderId;
		AckedBy = ackedBy;
		AcknowledgementSignature = acknowledgementSignature;
	}
}
