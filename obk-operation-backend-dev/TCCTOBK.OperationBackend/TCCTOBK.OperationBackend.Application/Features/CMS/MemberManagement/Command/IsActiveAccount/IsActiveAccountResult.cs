using System;

namespace TCCTOBK.OperationBackend.Application.Features.CMS.MemberManagement.Command.IsActiveAccount;

public class IsActiveAccountResult
{
	public Guid MID { get; set; }
	public string Email { get; set; } = default!;
	public int Status { get; set; }
	public string? KeyCloakUserId { get; set; }
	public bool IsActive { get; set; }
	public int FailAttempt { get; set; }
}
