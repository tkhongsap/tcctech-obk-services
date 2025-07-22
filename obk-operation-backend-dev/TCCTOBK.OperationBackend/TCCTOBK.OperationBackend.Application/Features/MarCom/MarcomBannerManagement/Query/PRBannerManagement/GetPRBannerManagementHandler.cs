using Microsoft.AspNetCore.Http;
using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Application.Features.Sustainability.PRBannerManagement.Query.GetPRBannerManagement;

namespace TCCTOBK.OperationBackend.Application.Features.Sustainability.PRBannerManagement.Query.GetPRBannerManagement;

public class GetMarcomBannerManagementHandler : IQueryHandler<GetMarcomBannerManagementQuery, GetMarcomBannerManagementResult>
{
	IUnitOfWork _uow;
	public GetMarcomBannerManagementHandler(IUnitOfWork uow)
	{
		_uow = uow;
	}
	public async Task<GetMarcomBannerManagementResult> Handle(GetMarcomBannerManagementQuery request, CancellationToken cancellationToken)
	{
		GetMarcomBannerManagementResult result = await _uow.MarcomRepository.GetPRBannerById(request.PRBannerID);

		return result;
	}
}
