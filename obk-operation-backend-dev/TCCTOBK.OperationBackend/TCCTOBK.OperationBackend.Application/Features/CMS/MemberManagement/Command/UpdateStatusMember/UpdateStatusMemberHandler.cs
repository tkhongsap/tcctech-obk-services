using MediatR;
using TCCTOBK.OperationBackend.Application.Contracts;

namespace TCCTOBK.OperationBackend.Application.Features.CMS.MemberManagement.Command.UpdateStatusMember;

internal class UpdateStatusMemberHandler : IRequestHandler<UpdateStatusMemberCommand, UpdateStatusMemberResult>
{
	IUnitOfWork _uow;
	public UpdateStatusMemberHandler(IUnitOfWork uow)
	{
		_uow = uow;
	}
	public async Task<UpdateStatusMemberResult> Handle(UpdateStatusMemberCommand request, CancellationToken cancellationToken)
	{
		_ = await _uow.MemberRepository.UpdateStatusMember(request.MID, request.Status, request);
		await _uow.SaveChangeAsyncWithCommit();
		return new UpdateStatusMemberResult();
	}
}
