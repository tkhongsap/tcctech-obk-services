using System;

namespace TCCTOBK.OperationBackend.Application.Features.CMS.MemberManagement.Command.UnblockAccount;

public class UnblockAccountResult
{
	public Guid MID { get; set; }
	public string Email { get; set; } = default!;
	public int Status { get; set; }
	public string? KeyCloakUserId { get; set; }
	public bool IsLocked { get; set; } = false;
	public int FailAttempt { get; set; }
}
