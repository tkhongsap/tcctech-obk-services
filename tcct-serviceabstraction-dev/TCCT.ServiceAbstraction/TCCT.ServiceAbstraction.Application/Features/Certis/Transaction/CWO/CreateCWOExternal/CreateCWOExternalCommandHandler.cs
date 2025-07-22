using TCCT.ServiceAbstraction.Application.Configuration.Commands;
using TCCT.ServiceAbstraction.Application.Contracts.Certis;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CWO.CreateCWOExternal;
public class CreateCWOExternalCommandHandler : ICommandHandler<CreateCWOExternalCommand, CreateCWOExternalResult>
{
	private readonly ICertisService _certisservice;
	public CreateCWOExternalCommandHandler(ICertisService certisservice)
	{
		_certisservice = certisservice;
	}
	public async Task<CreateCWOExternalResult> Handle(CreateCWOExternalCommand request, CancellationToken cancellationToken)
	{
		var res = await _certisservice.Transaction.CWOService.CWOExternal(request);
		return res;
	}
}
