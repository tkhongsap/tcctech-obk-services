using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Contracts.API;
using TCCTOBK.OperationBackend.Domain;

namespace TCCTOBK.OperationBackend.Application;

public class GetRemoteConfigDataHandler : IQueryHandler<GetRemoteConfigDataQuery, GetRemoteConfigDataResult>
{
	IAPIService _apiservice;
	public GetRemoteConfigDataHandler(IAPIService apiservice)
	{
		_apiservice = apiservice;
	}
	public async Task<GetRemoteConfigDataResult> Handle(GetRemoteConfigDataQuery request, CancellationToken cancellationToken)
	{
		try
		{
			var filebaseauth = new FirebaseOAuth(DomainConfig.FirebaseAdmin);
			var token = await filebaseauth.AuthRemoteConfig();

			var bearertoken = $"Bearer {token}";
			var data = await _apiservice.FirebaseRemoteConfig.GetRemoteConfig(bearertoken);
			return new GetRemoteConfigDataResult() { IsSuccess = true, data = data };
		}
		catch (Exception ee)
		{
			return new GetRemoteConfigDataResult() { IsSuccess = false, data = "cannot access firebase. " + ee.Message };
		}
	}
}
