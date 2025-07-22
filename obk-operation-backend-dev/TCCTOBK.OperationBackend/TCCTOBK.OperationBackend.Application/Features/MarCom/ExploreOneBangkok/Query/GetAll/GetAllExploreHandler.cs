using Microsoft.AspNetCore.Http;
using NPOI.POIFS.Properties;
using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Application.Features.Sustainability.PRBannerManagement.Query.GetAllDigitalLibrary;

namespace TCCTOBK.OperationBackend.Application.Features.Marcom.Explore.Query.GetAllExplore;

public class GetAllExploreHandler : IQueryHandler<GetAllExploreQuery, GetAllExploreResult>
{
	IUnitOfWork _uow;
	public GetAllExploreHandler(IUnitOfWork uow)
	{
		_uow = uow;
	}
	public async Task<GetAllExploreResult> Handle(GetAllExploreQuery request, CancellationToken cancellationToken)
	{
		ExploreResult explore = await _uow.MarcomRepository.GetAllExplore(request.Filter, request.Status, request);
		GetAllExploreResult result = new GetAllExploreResult()
		{
			Data = explore,
			StatusCode = StatusCodes.Status200OK
		};

		return result;
	}
}
