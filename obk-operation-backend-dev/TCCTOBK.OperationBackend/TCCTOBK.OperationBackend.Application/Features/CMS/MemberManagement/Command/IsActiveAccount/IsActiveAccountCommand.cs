using System;
using TCCTOBK.OperationBackend.Application.Configuration.Commands;

namespace TCCTOBK.OperationBackend.Application.Features.CMS.MemberManagement.Command.IsActiveAccount;

public class IsActiveAccountCommand : ICommand<IsActiveAccountResult>
{
	public Guid MID { get; set; }
	public Boolean IsActive { get; set; }
}
