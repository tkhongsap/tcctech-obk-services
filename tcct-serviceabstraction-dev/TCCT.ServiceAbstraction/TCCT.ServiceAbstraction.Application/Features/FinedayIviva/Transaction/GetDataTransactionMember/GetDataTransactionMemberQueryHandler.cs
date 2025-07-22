using TCCT.ServiceAbstraction.Application.Configuration.Queries;
using TCCT.ServiceAbstraction.Application.Contracts.FinedayIviva;

namespace TCCT.ServiceAbstraction.Application.Features.FinedayIviva.Transaction.GetDataTransactionMember;

public sealed class GetDataTransactionMemberQueryHandler : IQueryHandler<GetDataTransactionMemberQuery, GetDataTransactionMemberResult>
{
	private readonly IFinedayIvivaService _service;
	public GetDataTransactionMemberQueryHandler(IFinedayIvivaService service)
	{
		_service = service;
	}

	public async Task<GetDataTransactionMemberResult> Handle(GetDataTransactionMemberQuery request, CancellationToken cancellationToken)
	{
		var res = await _service.WithTransaction().GetDataTransactionMember(request.Page, request.PerPage, request.Search, request.StartDate, request.EndDate);
		return res;
	}

}

