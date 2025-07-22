using TCCT.ServiceAbstraction.Application.Configuration.Commands;
using TCCT.ServiceAbstraction.Application.Contracts.Certis;
using TCCT.ServiceAbstraction.Application.Exceptions;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.Core.Command.UpdateStaff;
public class UpdateStaffHandler : ICommandHandler<UpdateStaffCommand, UpdateStaffResult>
{
	private readonly ICertisService _certisservice;
	public UpdateStaffHandler(ICertisService certisservice)
	{
		_certisservice = certisservice;
	}
	public async Task<UpdateStaffResult> Handle(UpdateStaffCommand request, CancellationToken cancellationToken)
	{
		return await _certisservice.Transaction.CoreService.UpdateStaff(request);
	}
}