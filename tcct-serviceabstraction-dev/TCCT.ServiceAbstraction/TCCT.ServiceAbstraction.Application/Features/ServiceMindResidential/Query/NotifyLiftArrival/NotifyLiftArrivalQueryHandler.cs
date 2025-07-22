using TCCT.ServiceAbstraction.Application.Configuration.Queries;
using TCCT.ServiceAbstraction.Application.Contracts.ServiceMindResidential;
using TCCT.ServiceAbstraction.Application.Features.ServiceMindResidentialResponse;

namespace TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Query.NotifyLiftArrival;

public sealed class NotifyLiftArrivalQueryHandler : IQueryHandler<NotifyLiftArrivalQuery, NotifyLiftArrivalResult>
{
	private readonly IServiceMindResidential _service;
	public NotifyLiftArrivalQueryHandler(IServiceMindResidential service)
	{
		_service = service;
	}

	public async Task<NotifyLiftArrivalResult> Handle(NotifyLiftArrivalQuery request, CancellationToken cancellationToken)
	{
		return await _service.NotifyLiftArrival(request);
	}

}

