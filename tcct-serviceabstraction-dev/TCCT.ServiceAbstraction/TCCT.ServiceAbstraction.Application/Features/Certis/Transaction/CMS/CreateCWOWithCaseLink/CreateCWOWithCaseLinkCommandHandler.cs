using TCCT.ServiceAbstraction.Application.Configuration.Commands;
using TCCT.ServiceAbstraction.Application.Contracts.Certis;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CMS.CreateCWOWithCaseLink;
public class CreateCWOWithCaseLinkCommandHandler : ICommandHandler<CreateCWOWithCaseLinkCommand, List<CreateCWOWithCaseLinkResult>>
{
	private readonly ICertisService _certisservice;
	public CreateCWOWithCaseLinkCommandHandler(ICertisService certisservice)
	{
		_certisservice = certisservice;
	}
	public async Task<List<CreateCWOWithCaseLinkResult>> Handle(CreateCWOWithCaseLinkCommand request, CancellationToken cancellationToken)
	{
		var res = await _certisservice.Transaction.CMSService.CreateCWOWithCaseLink(request);
		return res;
	}
}
