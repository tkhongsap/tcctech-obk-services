namespace TCCT.ServiceAbstraction.Application.Features.Keycloak.UpdatePassword
{
	public class UpdatePasswordRequest
	{
		public string Username { get; set; } = null!;
		public string OldPassword { get; set; } = null!;
		public string NewPassword { get; set; } = null!;

	}
}
