using TCCT.ServiceAbstraction.Application.Configuration.Queries;
using TCCT.ServiceAbstraction.Application.Contracts.FinedayIviva;

namespace TCCT.ServiceAbstraction.Application.Features.FinedayIviva.Transaction.GetDataTransactionTurnstile;

public sealed class GetDataTransactionTurnstileQueryHandler : IQueryHandler<GetDataTransactionTurnstileQuery, GetDataTransactionTurnstileResult>
{
	private readonly IFinedayIvivaService _service;
	public GetDataTransactionTurnstileQueryHandler(IFinedayIvivaService service)
	{
		_service = service;
	}

	public async Task<GetDataTransactionTurnstileResult> Handle(GetDataTransactionTurnstileQuery request, CancellationToken cancellationToken)
	{
		var res = await _service.WithTransaction().GetDataTransactionTurnstile(request.Page, request.PerPage, request.Search, request.StartDate, request.EndDate);
		return res;
	}

}

