using TCCT.ServiceAbstraction.Application.Configuration.Queries;
using TCCT.ServiceAbstraction.Application.Contracts.FinedayIviva;

namespace TCCT.ServiceAbstraction.Application.Features.FinedayIviva.Transaction.GetDataTransactionVisitor;

public sealed class GetDataTransactionVisitorQueryHandler : IQueryHandler<GetDataTransactionVisitorQuery, GetDataTransactionVisitorResult>
{
	private readonly IFinedayIvivaService _service;
	public GetDataTransactionVisitorQueryHandler(IFinedayIvivaService service)
	{
		_service = service;
	}

	public async Task<GetDataTransactionVisitorResult> Handle(GetDataTransactionVisitorQuery request, CancellationToken cancellationToken)
	{
		var res = await _service.WithTransaction().GetDataTransactionVisitor(request.Page, request.PerPage, request.Search, request.StartDate, request.EndDate);
		return res;
	}

}

