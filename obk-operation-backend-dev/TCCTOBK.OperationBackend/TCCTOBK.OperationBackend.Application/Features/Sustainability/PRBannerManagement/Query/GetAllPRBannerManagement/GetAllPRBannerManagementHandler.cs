using Microsoft.AspNetCore.Http;
using NPOI.POIFS.Properties;
using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Application.Features.Sustainability.PRBannerManagement.Query.GetAllDigitalLibrary;

namespace TCCTOBK.OperationBackend.Application.Features.Sustainability.PRBannerManagement.Query.GetAllPRBannerManagement;

public class GetAllPRBannerManagementHandler : IQueryHandler<GetAllPRBannerManagementQuery, GetAllPRBannerManagementResult>
{
	IUnitOfWork _uow;
	public GetAllPRBannerManagementHandler(IUnitOfWork uow)
	{
		_uow = uow;
	}
	public async Task<GetAllPRBannerManagementResult> Handle(GetAllPRBannerManagementQuery request, CancellationToken cancellationToken)
	{
		PRBannerResult banner = await _uow.SustainabilityRepository.GetAllPRBanner(request.Filter, request.Status, request);
		GetAllPRBannerManagementResult result = new GetAllPRBannerManagementResult()
		{
			Data = banner,
			StatusCode = StatusCodes.Status200OK
		};

		return result;
	}
}
