using MediatR;
using TCCTOBK.OperationBackend.Application.Contracts;

namespace TCCTOBK.OperationBackend.Application;


public class UpdateMemberWithRoleHandler : IRequestHandler<UpdateMemberWithRoleCommand, UpdateMemberWithRoleResult>
{
	IUnitOfWork _uow;
	public UpdateMemberWithRoleHandler(IUnitOfWork uow)
	{
		_uow = uow;
	}
	public async Task<UpdateMemberWithRoleResult> Handle(UpdateMemberWithRoleCommand request, CancellationToken cancellationToken)
	{
		_ = await _uow.MemberRepository.UpdateStatusMember(request.MID, request.Status, request);
		await _uow.RoleRepository.UpdateRoleMember(request.MID, request.RoleItem);
		await _uow.SaveChangeAsyncWithCommit();
		return new UpdateMemberWithRoleResult() { message = "success" };
	}
}
