using System;
using TCCT.ServiceAbstraction.Application.Configuration.Commands;
using TCCT.ServiceAbstraction.Application.Contracts.Certis;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CMS.Media.Command;

public class CreateMediaHandler : ICommandHandler<CreateMediaCommand, CreateMediaResult>
{
    private readonly ICertisService _certisservice;
    public CreateMediaHandler(ICertisService certisservice)
    {
        _certisservice = certisservice;
    }
    public async Task<CreateMediaResult> Handle(CreateMediaCommand request, CancellationToken cancellationToken)
	{
		return await _certisservice.Transaction.CMSService.CreateMedia(request.CaseId, request.Media);
	}
}
