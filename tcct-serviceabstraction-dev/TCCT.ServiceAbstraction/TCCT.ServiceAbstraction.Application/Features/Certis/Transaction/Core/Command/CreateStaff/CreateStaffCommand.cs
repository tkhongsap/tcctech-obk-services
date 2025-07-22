using TCCT.ServiceAbstraction.Application.Configuration.Commands;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.Core.Command.CreateStaff;
public class CreateStaffCommand : ICommand<CreateStaffResult>
{
	public string? NRIC { get; set; }
	public string? FullName { get; set; }
	public string? FirstName { get; set; }
	public string? LastName { get; set; }
	public string? Company { get; set; }
	public string? StaffId { get; set; }
	public string? Username { get; set; }
	public bool? LoginEnabled { get; set; } = false;
	public string? Email { get; set; }
	public string? Mobile { get; set; }
	public int Status { get; set; }
}
