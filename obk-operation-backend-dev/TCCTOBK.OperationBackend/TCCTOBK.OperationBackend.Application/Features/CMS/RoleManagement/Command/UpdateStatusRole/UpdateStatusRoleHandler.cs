using TCCTOBK.OperationBackend.Application.Configuration.Commands;
using TCCTOBK.OperationBackend.Application.Contracts;

namespace TCCTOBK.OperationBackend.Application.Features.CMS.RoleManagement.Command.UpdateStatusRole;

internal class UpdateStatusRoleHandler : ICommandHandler<UpdateStatusRoleCommand, UpdateStatusRoleResult>
{
	private IUnitOfWork _repo;
	public UpdateStatusRoleHandler(IUnitOfWork repo)
	{
		_repo = repo;
	}
	public async Task<UpdateStatusRoleResult> Handle(UpdateStatusRoleCommand request, CancellationToken cancellationToken)
	{
		await _repo.RoleRepository.UpdateRoleStatus(request.Id, request.IsActive, request);
		var roleprivilege = await _repo.RoleRepository.GetById(request.Id);
		var roleprivilegeid = roleprivilege.trRolePrivilagesItem.Select(x => x.PTID).ToList();
		await _repo.PrivilegeRepository.UpdatePrivilegeItem(request.Id, roleprivilegeid, request.IsActive);
		await _repo.SaveChangeAsyncWithCommit();
		return new UpdateStatusRoleResult { Message = "Success" };
	}
}
