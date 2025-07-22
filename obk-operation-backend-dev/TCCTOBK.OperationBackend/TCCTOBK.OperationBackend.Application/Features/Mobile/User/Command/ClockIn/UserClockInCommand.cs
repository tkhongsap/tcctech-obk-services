using System;
using MediatR;

namespace TCCTOBK.OperationBackend.Application.Features.Mobile.User.Command.ClockIn;

public class UserClockInCommand : IRequest<UserClockInResult>
{
  public int StaffId { get; set; }
  public int ShiftId { get; set; }
  public int FunctionRoleId { get; set; }

}
