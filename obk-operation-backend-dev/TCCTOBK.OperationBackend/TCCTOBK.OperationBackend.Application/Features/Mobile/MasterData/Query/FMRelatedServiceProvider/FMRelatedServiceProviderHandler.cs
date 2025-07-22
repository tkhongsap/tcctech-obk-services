using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Contracts.API;
using TCCTOBK.OperationBackend.Application.Features.Mobile.MasterData.Query.FMRelatedServiceProvider;

namespace TCCTOBK.OperationBackend.Application.Features.Mobile.MasterData.Query.FMRelatedServiceProvider;
public class FMRelatedServiceProviderHandler : IQueryHandler<FMRelatedServiceProviderQuery, FMRelatedServiceProviderResult>
{
	private readonly IAbstractionService _apiService;

	public FMRelatedServiceProviderHandler(IAbstractionService apiService)
	{
		_apiService = apiService;
	}

	public async Task<FMRelatedServiceProviderResult> Handle(FMRelatedServiceProviderQuery request, CancellationToken cancellationToken)
	{
		#region Initail Response
		var res = new FMRelatedServiceProviderResult();
		#endregion

		return res;
	}
}
