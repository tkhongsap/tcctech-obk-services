using TCCT.ServiceAbstraction.Application.Features.Keycloak;

namespace TCCT.ServiceAbstraction.Application.Contracts.Keycloak
{
	public interface IKeycloakRealmService
	{
		IKeycloakRealmAdminService WithRealmAdmin();
		Task<KeycloakResponse> Login(string username, string password);
		Task<KeycloakResponse> RefreshToken(string refreshToken);
	}
}
