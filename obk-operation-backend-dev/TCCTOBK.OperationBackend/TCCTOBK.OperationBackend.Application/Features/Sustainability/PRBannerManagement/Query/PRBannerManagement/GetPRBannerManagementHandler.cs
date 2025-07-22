using Microsoft.AspNetCore.Http;
using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Application.Features.Sustainability.PRBannerManagement.Query.GetPRBannerManagement;

namespace TCCTOBK.OperationBackend.Application.Features.Sustainability.PRBannerManagement.Query.GetPRBannerManagement;

public class GetPRBannerManagementHandler : IQueryHandler<GetPRBannerManagementQuery, GetPRBannerManagementResult>
{
	IUnitOfWork _uow;
	public GetPRBannerManagementHandler(IUnitOfWork uow)
	{
		_uow = uow;
	}
	public async Task<GetPRBannerManagementResult> Handle(GetPRBannerManagementQuery request, CancellationToken cancellationToken)
	{
		GetPRBannerManagementResult result = await _uow.SustainabilityRepository.GetPRBannerById(request.PRBannerID);
		
		return result;
	}
}
