using TCCT.ServiceAbstraction.Application.Configuration.Commands;
using TCCT.ServiceAbstraction.Application.Contracts.Certis;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CMS.Cases.Command;
public class CasesCommandHandler : ICommandHandler<CasesCommand, CasesResult>
{
	private readonly ICertisService _certisservice;
	public CasesCommandHandler(ICertisService certisservice)
	{
		_certisservice = certisservice;
	}
	public async Task<CasesResult> Handle(CasesCommand request, CancellationToken cancellationToken)
	{
		var res = await _certisservice.Transaction.CMSService.CreateCases(request.ShortDesc, request.EquipmentTag, request.LocationId, request.EventTypeId, request.CaseTypeId, request.CaseDesc, request.Requester);
		return res;
	}
}
