using TCCT.ServiceAbstraction.Application.Configuration.Commands;
using TCCT.ServiceAbstraction.Application.Contracts.Certis;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.PPM.AssignSupervisor;
public class AssignSupervisorCommandHandler : ICommandHandler<AssignSupervisorCommand, AssignSupervisorResult>
{
	private readonly ICertisService _certisservice;
	public AssignSupervisorCommandHandler(ICertisService certisservice)
	{
		_certisservice = certisservice;
	}
	public async Task<AssignSupervisorResult> Handle(AssignSupervisorCommand request, CancellationToken cancellationToken)
	{
		var res = await _certisservice.Transaction.PPMService.AssignSupervisor(request.WoId, request.SupervisorId, request.AssignedBy);
		return res;
	}
}
