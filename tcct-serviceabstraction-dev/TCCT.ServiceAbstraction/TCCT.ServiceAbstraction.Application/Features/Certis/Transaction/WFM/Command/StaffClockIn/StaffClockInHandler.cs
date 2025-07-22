using TCCT.ServiceAbstraction.Application.Configuration.Commands;
using TCCT.ServiceAbstraction.Application.Contracts.Certis;
using TCCT.ServiceAbstraction.Application.Exceptions;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.WFM.Command.StaffClockIn;
public class StaffClockInHandler : ICommandHandler<StaffClockInCommand, StaffClockInResult>
{
	private readonly ICertisService _certisservice;
	public StaffClockInHandler(ICertisService certisservice)
	{
		_certisservice = certisservice;
	}
	public async Task<StaffClockInResult> Handle(StaffClockInCommand request, CancellationToken cancellationToken)
	{
		return await _certisservice.Transaction.WFMService.StaffClockIn(request);
	}
}