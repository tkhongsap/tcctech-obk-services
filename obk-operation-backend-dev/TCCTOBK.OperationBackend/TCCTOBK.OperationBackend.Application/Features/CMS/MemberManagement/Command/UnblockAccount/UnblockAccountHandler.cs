using System;
using TCCTOBK.OperationBackend.Application.Configuration.Commands;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Application.Exceptions;

namespace TCCTOBK.OperationBackend.Application.Features.CMS.MemberManagement.Command.UnblockAccount;

public class UnblockAccountHandler : ICommandHandler<UnblockAccountCommand, UnblockAccountResult>
{
	private readonly IUnitOfWork _uow;

	public UnblockAccountHandler(IUnitOfWork uow)
	{
		_uow = uow;
	}

	public async Task<UnblockAccountResult> Handle(UnblockAccountCommand request, CancellationToken cancellationToken)
	{
		var member = await _uow.MemberRepository.UnlockMemberById(request.MID);
		if (member == null)
		{
			throw new NotFoundException("User not found");
		}
		await _uow.SaveChangeAsyncWithCommit();

		return new UnblockAccountResult
		{
			MID = member.MID,
			Email = member.Email,
			Status = member.Status,
			KeyCloakUserId = member.KeyCloakUserId,
			IsLocked = member.IsLocked,
			FailAttempt = member.FailAttempt,
		};
	}
}
