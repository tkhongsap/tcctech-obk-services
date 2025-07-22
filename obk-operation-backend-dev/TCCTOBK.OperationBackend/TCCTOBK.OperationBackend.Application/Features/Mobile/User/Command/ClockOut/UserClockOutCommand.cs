using System;
using MediatR;

namespace TCCTOBK.OperationBackend.Application.Features.Mobile.User.Command.ClockOut;

public class UserClockOutCommand : IRequest<UserClockOutResult>
{
  public int StaffId { get; set; }
}
