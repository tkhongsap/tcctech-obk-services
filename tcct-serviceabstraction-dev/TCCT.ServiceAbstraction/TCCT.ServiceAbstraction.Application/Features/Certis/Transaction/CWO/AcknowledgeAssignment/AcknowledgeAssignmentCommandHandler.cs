using TCCT.ServiceAbstraction.Application.Configuration.Commands;
using TCCT.ServiceAbstraction.Application.Contracts.Certis;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CWO.AcknowledgeAssignment;
public class AcknowledgeAssignmentCommandHandler : ICommandHandler<AcknowledgeAssignmentCommand, AcknowledgeAssignmentResult>
{
	private readonly ICertisService _certisservice;
	public AcknowledgeAssignmentCommandHandler(ICertisService certisservice)
	{
		_certisservice = certisservice;
	}
	public async Task<AcknowledgeAssignmentResult> Handle(AcknowledgeAssignmentCommand request, CancellationToken cancellationToken)
	{
		var res = await _certisservice.Transaction.CWOService.AcknowledgeAssignment(request.CwoId, request.AckedBy, request.AckVerifiedBy, request.AcknowledgementSignature, request.SupportiveTechnicianIds, request.IsWorkingOffline, request.WorkOfflineReason, request.LocationId, request.Description, request.RequesterId, request.AssetId);
		return res;
	}
}
