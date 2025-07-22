using TCCT.ServiceAbstraction.Application.Configuration.Queries;
using TCCT.ServiceAbstraction.Application.Contracts.FinedayIviva;

namespace TCCT.ServiceAbstraction.Application.Features.FinedayIviva.Member.GetDataMemberCarPark;

public sealed class GetDataMemberCarParkQueryHandler : IQueryHandler<GetDataMemberCarParkQuery, GetDataMemberCarParkResult>
{
	private readonly IFinedayIvivaService _service;
	public GetDataMemberCarParkQueryHandler(IFinedayIvivaService service)
	{
		_service = service;
	}

	public async Task<GetDataMemberCarParkResult> Handle(GetDataMemberCarParkQuery request, CancellationToken cancellationToken)
	{
		var res = await _service.WithMember().GetDataMemberCarPark(request.Page, request.PerPage, request.Search, request.StartDate, request.EndDate, request.Active);
		return res;
	}

}

