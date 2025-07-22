namespace TCCTOBK.OperationBackend.Application.Features.Mobile.Core;
public class UpdateStaffCommand
{
	public int Id { get; set; }
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
