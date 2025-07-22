namespace TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Command.AuthorizeTenant;

public class AuthorizeTenantResult
{
	public string accessToken { get; set; } = null!;
	public string tokenValidFor { get; set; } = null!;
	public long tokenExpiryTime { get; set; }
}