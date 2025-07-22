using TCCT.ServiceAbstraction.Application.Features.Keycloak.AddAuthAlias;
using TCCT.ServiceAbstraction.Application.Features.Keycloak.CreateUser;
using TCCT.ServiceAbstraction.Application.Features.Keycloak.EventsLog;
using TCCT.ServiceAbstraction.Application.Features.Keycloak.GetUser;
using TCCT.ServiceAbstraction.Application.Features.Keycloak.RemoveAuthAlias;
using TCCT.ServiceAbstraction.Application.Features.Keycloak.ResetPassword;
using TCCT.ServiceAbstraction.Application.Features.Keycloak.UpdatePassword;

namespace TCCT.ServiceAbstraction.Application.Contracts.Keycloak
{
	public interface IKeycloakRealmAdminService
	{
		Task<CreateUserResult> CreateUser(string emailOrPhone, string password, string firstName, string lastName, bool forceAddEmail);
		Task<GetUserInternalResult> GetUserByUsernameOrAttribute(string usernameOrAttribute, bool throwKCS001ifnotfound = false);
		Task<List<EventsLogRespones>> GetEventLog(int max, string type, DateOnly? dateFrom, DateOnly? dateTo, int? first, Guid? user);

		Task<UpdatePasswordResult> UpdatePassword(string usernameOrAttribute, string oldPassword, string newPassword);
		Task<ResetPasswordResult> ResetPassword(string usernameOrAttribute, string newPassword);
		Task<AddAuthAliasResult> AddAuthAlias(string usernameOrAttribute, string newAttribute);
		Task<RemoveAuthAliasResult> RemoveAuthAlias(string usernameOrAttribute, string removeAttribute, bool cannotRemoveEmail);
	}
}
