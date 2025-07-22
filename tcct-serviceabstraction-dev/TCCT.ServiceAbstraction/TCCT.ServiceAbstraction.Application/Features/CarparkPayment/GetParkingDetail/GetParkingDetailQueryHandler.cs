using TCCT.ServiceAbstraction.Application.Configuration.Queries;
using TCCT.ServiceAbstraction.Application.Contracts.CarparkPayment;

namespace TCCT.ServiceAbstraction.Application.Features.CarparkPayment.GetParkingDetail;

public sealed class GetParkingDetailQueryHandler : IQueryHandler<GetParkingDetailQuery, GetParkingDetailResult>
{
	private readonly ICarparkPaymentService _service;
	public GetParkingDetailQueryHandler(ICarparkPaymentService service)
	{
		_service = service;
	}

	public async Task<GetParkingDetailResult> Handle(GetParkingDetailQuery request, CancellationToken cancellationToken)
	{
		return await _service.GetParkingDetail(request.Search, request.LostCard);
	}

}

