namespace TCCTOBK.OperationBackend.Application;

public class Users
{
	public Guid? Id { get; set; }
	public string? Username { get; set; }
	public string? Email { get; set; }
	public string? Mobile { get; set; }
	public string? FullName { get; set; }
	public string? FirstName { get; set; }
	public string? LastName { get; set; }
	public string? StaffNo { get; set; }
	public string? MobileDeviceId { get; set; }
	public string? BodyWornId { get; set; }
	public bool? Disabled { get; set; }
	public bool? Pdpa { get; set; }
	public string? TemporaryPassword { get; set; }
}
