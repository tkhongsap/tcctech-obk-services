using TCCT.ServiceAbstraction.Application.Configuration.Commands;
using TCCT.ServiceAbstraction.Application.Contracts.Certis;
using TCCT.ServiceAbstraction.Application.Exceptions;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.Core.Command.DeleteStaffRoleMapping;
public class DeleteStaffRoleMappingHandler : ICommandHandler<DeleteStaffRoleMappingCommand, DeleteStaffRoleMappingResult>
{
	private readonly ICertisService _certisservice;
	public DeleteStaffRoleMappingHandler(ICertisService certisservice)
	{
		_certisservice = certisservice;
	}
	public async Task<DeleteStaffRoleMappingResult> Handle(DeleteStaffRoleMappingCommand request, CancellationToken cancellationToken)
	{
		return await _certisservice.Transaction.CoreService.DeleteStaffRoleMapping(request);
	}
}