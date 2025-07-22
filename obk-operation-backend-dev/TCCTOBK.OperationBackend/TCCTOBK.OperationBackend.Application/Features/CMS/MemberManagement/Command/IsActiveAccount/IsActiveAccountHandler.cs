using System;
using TCCTOBK.OperationBackend.Application.Configuration.Commands;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Application.Exceptions;

namespace TCCTOBK.OperationBackend.Application.Features.CMS.MemberManagement.Command.IsActiveAccount;

public class IsActiveAccountHandler : ICommandHandler<IsActiveAccountCommand, IsActiveAccountResult>
{
	private readonly IUnitOfWork _uow;

	public IsActiveAccountHandler(IUnitOfWork uow)
	{
		_uow = uow;
	}

	public async Task<IsActiveAccountResult> Handle(IsActiveAccountCommand request, CancellationToken cancellationToken)
	{
		var member = await _uow.MemberRepository.IsActiveById(request.MID,request.IsActive);
		if (member == null)
		{
			throw new NotFoundException("User not found");
		}
		await _uow.SaveChangeAsyncWithCommit();

		return new IsActiveAccountResult
		{
			MID = member.MID,
			Email = member.Email,
			Status = member.Status,
			KeyCloakUserId = member.KeyCloakUserId,
			IsActive = member.IsActive,
			FailAttempt = member.FailAttempt,
		};
	}
}
