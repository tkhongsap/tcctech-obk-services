using TCCT.ServiceAbstraction.Application.Configuration.Commands;
using TCCT.ServiceAbstraction.Application.Contracts.Certis;
using TCCT.ServiceAbstraction.Application.Exceptions;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.WFM.Command.StaffClockOut;
public class StaffClockOutHandler : ICommandHandler<StaffClockOutCommand, StaffClockOutResult>
{
	private readonly ICertisService _certisservice;
	public StaffClockOutHandler(ICertisService certisservice)
	{
		_certisservice = certisservice;
	}
	public async Task<StaffClockOutResult> Handle(StaffClockOutCommand request, CancellationToken cancellationToken)
	{
		return await _certisservice.Transaction.WFMService.StaffClockOut(request);
	}
}