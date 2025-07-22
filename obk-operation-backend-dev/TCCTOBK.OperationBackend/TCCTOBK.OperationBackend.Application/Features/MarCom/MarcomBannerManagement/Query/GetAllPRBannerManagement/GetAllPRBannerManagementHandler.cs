using Microsoft.AspNetCore.Http;
using NPOI.POIFS.Properties;
using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Application.Features.Sustainability.PRBannerManagement.Query.GetAllDigitalLibrary;

namespace TCCTOBK.OperationBackend.Application.Features.Sustainability.PRBannerManagement.Query.GetAllPRBannerManagement;

public class GetAllMarcomBannerManagementHandler : IQueryHandler<GetAllMarcomBannerManagementQuery, GetAllMarcomBannerManagementResult>
{
	IUnitOfWork _uow;
	public GetAllMarcomBannerManagementHandler(IUnitOfWork uow)
	{
		_uow = uow;
	}
	public async Task<GetAllMarcomBannerManagementResult> Handle(GetAllMarcomBannerManagementQuery request, CancellationToken cancellationToken)
	{
		MarcomBannerResult banner = await _uow.MarcomRepository.GetAllPRBanner(request.Filter, request.Status, request);
		GetAllMarcomBannerManagementResult result = new GetAllMarcomBannerManagementResult()
		{
			Data = banner,
			StatusCode = StatusCodes.Status200OK
		};

		return result;
	}
}
