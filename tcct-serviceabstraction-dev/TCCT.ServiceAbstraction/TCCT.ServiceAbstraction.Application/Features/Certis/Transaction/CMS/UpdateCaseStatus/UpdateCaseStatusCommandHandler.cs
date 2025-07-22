using TCCT.ServiceAbstraction.Application.Configuration.Commands;
using TCCT.ServiceAbstraction.Application.Contracts.Certis;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CMS.UpdateCaseStatus;
public class UpdateCaseStatusCommandHandler : ICommandHandler<UpdateCaseStatusCommand, UpdateCaseStatusResult>
{
	private readonly ICertisService _certisservice;
	public UpdateCaseStatusCommandHandler(ICertisService certisservice)
	{
		_certisservice = certisservice;
	}
	public async Task<UpdateCaseStatusResult> Handle(UpdateCaseStatusCommand request, CancellationToken cancellationToken)
	{
		var res = await _certisservice.Transaction.CMSService.UpdateCaseStatus(request);
		return res;
	}
}
