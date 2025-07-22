using System;
using System.Windows.Input;
using TCCTOBK.OperationBackend.Application.Configuration.Commands;

namespace TCCTOBK.OperationBackend.Application.Features.Mobile.User.Command.StampUpdatedMember;

public class StampUpdatedMemberCommand : ICommand<StampUpdatedMemberResult>
{
  public Guid MID { get; set; }
  public Guid UpdatedBy { get; set; }
  public string UpdatedByName { get; set; }
}
