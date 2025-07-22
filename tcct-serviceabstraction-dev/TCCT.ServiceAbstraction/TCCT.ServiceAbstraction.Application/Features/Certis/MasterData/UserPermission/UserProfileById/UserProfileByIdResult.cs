namespace TCCT.ServiceAbstraction.Application.Features.Certis.MasterData.UserPermission.UserProfileById;

public class UserProfileByIdResult
{
	public string Id { get; set; } = null!;
	public string Email { get; set; } = null!;
	public string Mobile { get; set; } = null!;
	public string FullName { get; set; } = null!;
	public string FirstName { get; set; } = null!;
	public string LastName { get; set; } = null!;
	public string StaffNo { get; set; } = null!;
	public bool Disabled { get; set; }
}