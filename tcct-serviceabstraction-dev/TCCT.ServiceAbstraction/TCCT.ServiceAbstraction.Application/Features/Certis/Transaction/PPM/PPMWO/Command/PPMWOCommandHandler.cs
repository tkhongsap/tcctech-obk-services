using TCCT.ServiceAbstraction.Application.Configuration.Commands;
using TCCT.ServiceAbstraction.Application.Contracts.Certis;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.PPM.PPMWO.Command;
public class PPMWOCommandHandler : ICommandHandler<PPMWOCommand, PPMWOResult>
{
	private readonly ICertisService _certisservice;
	public PPMWOCommandHandler(ICertisService certisservice)
	{
		_certisservice = certisservice;
	}
	public async Task<PPMWOResult> Handle(PPMWOCommand request, CancellationToken cancellationToken)
	{
		var res = await _certisservice.Transaction.PPMService.PPMWO(request.MwoId, request.ChecklistMapId);
		return res;
	}
}
