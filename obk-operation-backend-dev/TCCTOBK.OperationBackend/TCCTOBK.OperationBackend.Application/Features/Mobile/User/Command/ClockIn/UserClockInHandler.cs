using System;
using MediatR;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Application.Contracts.API;
using TCCTOBK.OperationBackend.Application.Features.Mobile.User.Model;

namespace TCCTOBK.OperationBackend.Application.Features.Mobile.User.Command.ClockIn;

public class UserClockInHandler : IRequestHandler<UserClockInCommand, UserClockInResult>
{
  private readonly IUnitOfWork _uow;
  private readonly IAbstractionService _abstractionService;
  public UserClockInHandler(IAbstractionService abstractionService, IUnitOfWork uow)
  {
    _abstractionService = abstractionService;
    _uow = uow;
  }

  public async Task<UserClockInResult> Handle(UserClockInCommand request, CancellationToken cancellationToken)
  {
    var data = new ClockInModel
    {
      staffId = request.StaffId,
      shiftId = request.ShiftId,
      functionRoleId = request.FunctionRoleId
    };
    var result = await _abstractionService.CertisTransaction.wfmClockIn(data);
    return new UserClockInResult();
  }
}
