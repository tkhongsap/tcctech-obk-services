namespace TCCT.ServiceAbstraction.Application.Features.Certis.MasterData.UserPermission.PermissionGroupinfoById;

public class PermissionGroupinfoByIdResult
{
	public int Id { get; set; }
	public int PermissionGroupId { get; set; }
	public string UserId { get; set; } = null!;
	public User User { get; set; } = null!;
}
public class User
{
	public string Id { get; set; } = null!;
	public string Username { get; set; } = null!;
	public string Email { get; set; } = null!;
	public bool EmailVerified { get; set; }
	public string Mobile { get; set; } = null!;
	public string FullName { get; set; } = null!;
	public string FirstName { get; set; } = null!;
	public string LastName { get; set; } = null!;
	public string StaffNo { get; set; } = null!;
	public string MobileDeviceId { get; set; } = null!;
	public string BodyWornId { get; set; } = null!;
	public string CreatedBy { get; set; } = null!;
	public DateTime CreatedOn { get; set; }
	public bool Disabled { get; set; }
	public UserSettings UserSettings { get; set; } = null!;
}

public class UserSettings
{
	public bool show_flooralerts { get; set; }
	public bool disable_alertsound { get; set; }
	public bool loop_alertsound { get; set; }
	public List<object> shortcuts { get; set; } = null!;
}