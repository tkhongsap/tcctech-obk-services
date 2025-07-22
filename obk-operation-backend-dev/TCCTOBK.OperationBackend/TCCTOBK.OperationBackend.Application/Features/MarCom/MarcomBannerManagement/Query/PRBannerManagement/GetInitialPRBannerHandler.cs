using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Contracts;

namespace TCCTOBK.OperationBackend.Application.Features.Sustainability.PRBannerManagement.Query.GetPRBannerManagement;

public class GetInitialMarcomBannerHandler : IQueryHandler<InitialMarcomBannerQuery, GetInitialMarcomBannerResult>
{
	IUnitOfWork _uow;
	public GetInitialMarcomBannerHandler(IUnitOfWork uow)
	{
		_uow = uow;
	}
	public async Task<GetInitialMarcomBannerResult> Handle(InitialMarcomBannerQuery request, CancellationToken cancellationToken)
	{
		GetInitialMarcomBannerResult result = await _uow.MarcomRepository.GetInitialBanner();

		return result;
	}
}
