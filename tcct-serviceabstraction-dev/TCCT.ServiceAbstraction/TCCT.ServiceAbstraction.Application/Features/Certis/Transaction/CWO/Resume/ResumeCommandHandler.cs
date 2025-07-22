using TCCT.ServiceAbstraction.Application.Configuration.Commands;
using TCCT.ServiceAbstraction.Application.Contracts.Certis;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CWO.Resume;
public class ResumeCommandHandler : ICommandHandler<ResumeCommand, ResumeResult>
{
	private readonly ICertisService _certisservice;
	public ResumeCommandHandler(ICertisService certisservice)
	{
		_certisservice = certisservice;
	}
	public async Task<ResumeResult> Handle(ResumeCommand request, CancellationToken cancellationToken)
	{
		var res = await _certisservice.Transaction.CWOService.Resume(request.CwoId, request.ResumedBy);
		return res;
	}
}
