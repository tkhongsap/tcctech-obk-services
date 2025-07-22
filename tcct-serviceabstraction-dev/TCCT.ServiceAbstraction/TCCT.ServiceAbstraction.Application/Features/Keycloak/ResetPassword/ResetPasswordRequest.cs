namespace TCCT.ServiceAbstraction.Application.Features.Keycloak.ResetPassword
{
	public class ResetPasswordRequest
	{
		public string Username { get; set; } = null!;
		public string NewPassword { get; set; } = null!;
	}
}
