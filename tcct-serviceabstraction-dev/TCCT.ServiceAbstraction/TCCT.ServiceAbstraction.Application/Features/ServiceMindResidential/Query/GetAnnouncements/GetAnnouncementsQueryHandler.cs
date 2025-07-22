using TCCT.ServiceAbstraction.Application.Configuration.Queries;
using TCCT.ServiceAbstraction.Application.Contracts.ServiceMindResidential;
using TCCT.ServiceAbstraction.Application.Features.ServiceMindResidentialResponse;

namespace TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Query.GetAnnouncements;

public sealed class GetAnnouncementsQueryHandler : IQueryHandler<GetAnnouncementsQuery, GetAnnouncementsResult>
{
	private readonly IServiceMindResidential _service;
	public GetAnnouncementsQueryHandler(IServiceMindResidential service)
	{
		_service = service;
	}

	public async Task<GetAnnouncementsResult> Handle(GetAnnouncementsQuery request, CancellationToken cancellationToken)
	{
		return await _service.GetAnnouncements(request);
	}

}

