using TCCT.ServiceAbstraction.Application.Configuration.Commands;
using TCCT.ServiceAbstraction.Application.Contracts.Certis;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.PPM.AcknowledgeAssignment;
public class AcknowledgeAssignmentCommandHandler : ICommandHandler<AcknowledgeAssignmentCommand, AcknowledgeAssignmentResult>
{
	private readonly ICertisService _certisservice;
	public AcknowledgeAssignmentCommandHandler(ICertisService certisservice)
	{
		_certisservice = certisservice;
	}
	public async Task<AcknowledgeAssignmentResult> Handle(AcknowledgeAssignmentCommand request, CancellationToken cancellationToken)
	{
		var res = await _certisservice.Transaction.PPMService.AcknowledgeAssignment(request.WoId, request.AckedBy, request.AcknowledgementSignature);
		return res;
	}
}
