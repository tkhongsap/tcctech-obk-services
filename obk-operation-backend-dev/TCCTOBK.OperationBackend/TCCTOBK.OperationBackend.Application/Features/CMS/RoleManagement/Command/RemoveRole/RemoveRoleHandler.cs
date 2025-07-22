using TCCTOBK.OperationBackend.Application.Configuration.Commands;
using TCCTOBK.OperationBackend.Application.Contracts;

namespace TCCTOBK.OperationBackend.Application.Features.CMS.RoleManagement.Command.RemoveRole;
internal class RemoveRoleHandler : ICommandHandler<RemoveRoleCommand, int>
{
	private readonly IUnitOfWork _uow;

	public RemoveRoleHandler(IUnitOfWork uow)
	{
		_uow = uow;
	}

	public Task<int> Handle(RemoveRoleCommand request, CancellationToken cancellationToken)
	{
		return _uow.RoleRepository.RemoveRole(request.RoleId, request);
	}
}
