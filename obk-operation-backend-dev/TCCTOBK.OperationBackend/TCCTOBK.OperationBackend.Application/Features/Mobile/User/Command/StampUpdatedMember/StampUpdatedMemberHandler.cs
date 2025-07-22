using System;
using System.Windows.Input;
using Org.BouncyCastle.Ocsp;
using TCCTOBK.OperationBackend.Application.Configuration.Commands;
using TCCTOBK.OperationBackend.Application.Contracts;

namespace TCCTOBK.OperationBackend.Application.Features.Mobile.User.Command.StampUpdatedMember;

public class StampUpdatedMemberHandler : ICommandHandler<StampUpdatedMemberCommand, StampUpdatedMemberResult>
{
  private readonly IUnitOfWork _uow;

  public StampUpdatedMemberHandler(IUnitOfWork uow)
  {
    _uow = uow;
  }

  public async Task<StampUpdatedMemberResult> Handle(StampUpdatedMemberCommand command, CancellationToken cancellationToken)
  {
    await _uow.MemberRepository.StampUpdatedBy(command.MID, command.UpdatedBy, command.UpdatedByName);
    await _uow.SaveChangeAsyncWithCommit();
    return new StampUpdatedMemberResult();
  }
}
