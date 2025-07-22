using Microsoft.AspNetCore.Http;
using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Application.Features.Sustainability.PRBannerManagement.Query.GetPRBannerManagement;

namespace TCCTOBK.OperationBackend.Application.Features.Marcom.Explore.Query.GetExplore;

public class GetExploreHandler : IQueryHandler<GetExploreQuery, GetExploreResult>
{
	IUnitOfWork _uow;
	public GetExploreHandler(IUnitOfWork uow)
	{
		_uow = uow;
	}
	public async Task<GetExploreResult> Handle(GetExploreQuery request, CancellationToken cancellationToken)
	{
		GetExploreResult result = await _uow.MarcomRepository.GetExploreById(request.ExploreID);

		return result;
	}
}
