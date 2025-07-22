using TCCT.ServiceAbstraction.Application.Configuration.Commands;
using TCCT.ServiceAbstraction.Application.Contracts.Certis;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.PPM.AssignTechnician;
public class AssignTechnicianCommandHandler : ICommandHandler<AssignTechnicianCommand, AssignTechnicianResult>
{
	private readonly ICertisService _certisservice;
	public AssignTechnicianCommandHandler(ICertisService certisservice)
	{
		_certisservice = certisservice;
	}
	public async Task<AssignTechnicianResult> Handle(AssignTechnicianCommand request, CancellationToken cancellationToken)
	{
		var res = await _certisservice.Transaction.PPMService.AssignTechnician(request.WoId, request.TechnicianIds, request.AssignedBy);
		return res;
	}
}
