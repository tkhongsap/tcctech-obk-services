using System;
using MediatR;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Application.Contracts.API;
using TCCTOBK.OperationBackend.Application.Features.Mobile.User.Model;

namespace TCCTOBK.OperationBackend.Application.Features.Mobile.User.Command.ClockOut;

public class UserClockOutHandler : IRequestHandler<UserClockOutCommand, UserClockOutResult>
{
  private readonly IUnitOfWork _uow;
  private readonly IAbstractionService _abstractionService;
  public UserClockOutHandler(IAbstractionService abstractionService, IUnitOfWork uow)
  {
    _abstractionService = abstractionService;
    _uow = uow;
  }
  public async Task<UserClockOutResult> Handle(UserClockOutCommand request, CancellationToken cancellationToken)
  {
    var data = new ClockOutModel
    {
      staffId = request.StaffId
    };
    var result = await _abstractionService.CertisTransaction.wfmClockOut(data);
    return new UserClockOutResult();
  }
}
