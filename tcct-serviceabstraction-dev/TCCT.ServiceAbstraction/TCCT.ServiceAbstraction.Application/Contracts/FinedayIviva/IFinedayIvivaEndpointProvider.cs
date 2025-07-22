namespace TCCT.ServiceAbstraction.Application.Contracts.FinedayIviva;
public interface IFinedayIvivaEndpointProvider
{
	HttpClient GetClientFromFactory();
	Task<HttpClient> GetClientFromFactoryWithBearer();
	//string GetLoginLoginUrl();
	//string GetLoginLogoutUrl();
	//string GetLoginCheckTokenUrl();
	//string GetLoginForceLogoutUrl();
	//string GetLoginTestConnectionUrl();
	string GetMemberGetDataMember();
	string GetMemberGetDataMemberCarpark();
	string GetTenantGetDataTenant();
	string GetTransactionGetDataTransactionCarpark();
	string GetTransactionGetDataTransactionMember();
	string GetTransactionGetDataTransactionVisitor();
	string GetTransactionGetDataTransactionTurnstile();
}
