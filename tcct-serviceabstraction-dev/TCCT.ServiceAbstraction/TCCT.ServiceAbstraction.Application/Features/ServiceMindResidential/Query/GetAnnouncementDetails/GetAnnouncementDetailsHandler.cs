using TCCT.ServiceAbstraction.Application.Configuration.Queries;
using TCCT.ServiceAbstraction.Application.Contracts.ServiceMindResidential;

namespace TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Query.GetAnnouncementDetails;

public sealed class GetAnnouncementDetailsQueryHandler : IQueryHandler<GetAnnouncementDetailsQuery, GetAnnouncementDetailsResult>
{
	private readonly IServiceMindResidential _service;
	public GetAnnouncementDetailsQueryHandler(IServiceMindResidential service)
	{
		_service = service;
	}

	public async Task<GetAnnouncementDetailsResult> Handle(GetAnnouncementDetailsQuery request, CancellationToken cancellationToken)
	{
		return await _service.GetAnnouncementDetails(request);
	}

}

