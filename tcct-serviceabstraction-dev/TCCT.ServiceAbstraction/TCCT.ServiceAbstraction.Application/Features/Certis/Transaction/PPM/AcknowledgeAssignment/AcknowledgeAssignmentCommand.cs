using TCCT.ServiceAbstraction.Application.Configuration.Commands;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.PPM.AcknowledgeAssignment;
public class AcknowledgeAssignmentCommand : ICommand<AcknowledgeAssignmentResult>
{
	public int WoId { get; set; }
	public Guid AckedBy { get; set; }
	public string AcknowledgementSignature { get; set; } = null!;

	public AcknowledgeAssignmentCommand(AcknowledgeAssignmentRequest request)
	{
		WoId = request.WorkOrderId;
		AckedBy = request.AckedBy;
		AcknowledgementSignature = request.AcknowledgementSignature;
	}
}
