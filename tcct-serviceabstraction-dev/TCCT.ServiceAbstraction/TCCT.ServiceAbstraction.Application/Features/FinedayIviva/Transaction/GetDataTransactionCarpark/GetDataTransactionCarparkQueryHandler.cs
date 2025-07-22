using TCCT.ServiceAbstraction.Application.Configuration.Queries;
using TCCT.ServiceAbstraction.Application.Contracts.FinedayIviva;

namespace TCCT.ServiceAbstraction.Application.Features.FinedayIviva.Transaction.GetDataTransactionCarpark;

public sealed class GetDataTransactionCarparkQueryHandler : IQueryHandler<GetDataTransactionCarparkQuery, GetDataTransactionCarparkResult>
{
	private readonly IFinedayIvivaService _service;
	public GetDataTransactionCarparkQueryHandler(IFinedayIvivaService service)
	{
		_service = service;
	}

	public async Task<GetDataTransactionCarparkResult> Handle(GetDataTransactionCarparkQuery request, CancellationToken cancellationToken)
	{
		var res = await _service.WithTransaction().GetDataTransactionCarpark(
				request.Page, request.PerPage, request.CarNo, request.EntryDate, request.ExitDate,
				request.LogEntry, request.StatusLog, request.TerminalEntry, request.TicketNo, request.VehicleType
			);
		return res;
	}

}

