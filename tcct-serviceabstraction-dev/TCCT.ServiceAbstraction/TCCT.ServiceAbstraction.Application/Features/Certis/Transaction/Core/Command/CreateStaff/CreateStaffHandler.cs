using TCCT.ServiceAbstraction.Application.Configuration.Commands;
using TCCT.ServiceAbstraction.Application.Contracts.Certis;
using TCCT.ServiceAbstraction.Application.Exceptions;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.Core.Command.CreateStaff;
public class CreateStaffHandler : ICommandHandler<CreateStaffCommand, CreateStaffResult>
{
	private readonly ICertisService _certisservice;
	public CreateStaffHandler(ICertisService certisservice)
	{
		_certisservice = certisservice;
	}
	public async Task<CreateStaffResult> Handle(CreateStaffCommand request, CancellationToken cancellationToken)
	{
		return await _certisservice.Transaction.CoreService.CreateStaff(request);
	}
}