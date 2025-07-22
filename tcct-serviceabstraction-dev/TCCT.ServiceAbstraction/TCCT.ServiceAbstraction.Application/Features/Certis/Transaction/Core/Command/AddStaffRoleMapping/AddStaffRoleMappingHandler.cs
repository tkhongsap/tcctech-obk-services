using TCCT.ServiceAbstraction.Application.Configuration.Commands;
using TCCT.ServiceAbstraction.Application.Contracts.Certis;
using TCCT.ServiceAbstraction.Application.Exceptions;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.Core.Command.AddStaffRoleMapping;
public class AddStaffRoleMappingHandler : ICommandHandler<AddStaffRoleMappingCommand, AddStaffRoleMappingResult>
{
	private readonly ICertisService _certisservice;
	public AddStaffRoleMappingHandler(ICertisService certisservice)
	{
		_certisservice = certisservice;
	}
	public async Task<AddStaffRoleMappingResult> Handle(AddStaffRoleMappingCommand request, CancellationToken cancellationToken)
	{
		return await _certisservice.Transaction.CoreService.AddStaffRoleMapping(request);
	}
}