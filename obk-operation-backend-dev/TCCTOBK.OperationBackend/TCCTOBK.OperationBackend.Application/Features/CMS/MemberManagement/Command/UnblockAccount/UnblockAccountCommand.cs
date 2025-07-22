using System;
using TCCTOBK.OperationBackend.Application.Configuration.Commands;

namespace TCCTOBK.OperationBackend.Application.Features.CMS.MemberManagement.Command.UnblockAccount;

public class UnblockAccountCommand : ICommand<UnblockAccountResult>
{
	public Guid MID { get; set; }
}
