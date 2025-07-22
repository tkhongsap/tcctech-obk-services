using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Contracts;

namespace TCCTOBK.OperationBackend.Application.Features.Sustainability.PRBannerManagement.Query.GetPRBannerManagement;

public class GetInitialPRBannerHandler : IQueryHandler<InitialPRBannerQuery, GetInitialPRBannerResult>
{
	IUnitOfWork _uow;
	public GetInitialPRBannerHandler(IUnitOfWork uow)
	{
		_uow = uow;
	}
	public async Task<GetInitialPRBannerResult> Handle(InitialPRBannerQuery request, CancellationToken cancellationToken)
	{
		GetInitialPRBannerResult result = await _uow.SustainabilityRepository.GetInitialBanner();

		return result;
	}
}
