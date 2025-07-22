using TCCT.ServiceAbstraction.Application.Configuration.Queries;
using TCCT.ServiceAbstraction.Application.Contracts.FinedayIviva;

namespace TCCT.ServiceAbstraction.Application.Features.FinedayIviva.Member.GetDataMember;

public sealed class GetDataMemberQueryHandler : IQueryHandler<GetDataMemberQuery, GetDataMemberResult>
{
	private readonly IFinedayIvivaService _service;
	public GetDataMemberQueryHandler(IFinedayIvivaService service)
	{
		_service = service;
	}

	public async Task<GetDataMemberResult> Handle(GetDataMemberQuery request, CancellationToken cancellationToken)
	{
		var res = await _service.WithMember().GetDataMember(request.Page, request.PerPage, request.Search, request.StartDate, request.EndDate, request.Active);
		return res;
	}

}

