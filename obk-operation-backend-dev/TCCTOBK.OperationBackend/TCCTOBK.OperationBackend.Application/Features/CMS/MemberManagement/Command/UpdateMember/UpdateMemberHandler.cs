using MediatR;
using TCCTOBK.OperationBackend.Application.Contracts;

namespace TCCTOBK.OperationBackend.Application.Features.CMS.MemberManagement.Command.UpdateMember;

internal class UpdateMemberHandler : IRequestHandler<UpdateMemberCommand, UpdateMemberResult>
{
	IUnitOfWork _uow;
	public UpdateMemberHandler(IUnitOfWork uow)
	{
		_uow = uow;
	}
	public async Task<UpdateMemberResult> Handle(UpdateMemberCommand request, CancellationToken cancellationToken)
	{
		_ = await _uow.MemberRepository.GetById(request.MID);
		if (request.KeycloakUser != null)
		{
			_ = await _uow.MemberRepository.UpdateMember(request.MID, request.Name, request.Status, request.KeycloakUser, request);
			await _uow.InviteMemberRepository.UpdateStatusMID(request.MID);
		}
		else
		{
			_ = await _uow.MemberRepository.UpdateMember(request.MID, request.Name, request.Status, request.IsActive, request);
		}
		await _uow.SaveChangeAsyncWithCommit();
		return new UpdateMemberResult();
	}
}