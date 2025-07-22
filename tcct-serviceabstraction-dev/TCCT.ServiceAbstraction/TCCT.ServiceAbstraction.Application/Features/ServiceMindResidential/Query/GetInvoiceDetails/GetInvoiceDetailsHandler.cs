
using TCCT.ServiceAbstraction.Application.Configuration.Queries;
using TCCT.ServiceAbstraction.Application.Contracts.ServiceMindResidential;

namespace TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Query.GetInvoiceDetails;
public class GetInvoiceDetailsHandler : IQueryHandler<GetInvoiceDetailsQuery, GetInvoiceDetailsResult>
{
	private readonly IServiceMindResidential _service;
	public GetInvoiceDetailsHandler(IServiceMindResidential service)
	{
		_service = service;
	}
	public async Task<GetInvoiceDetailsResult> Handle(GetInvoiceDetailsQuery request, CancellationToken cancellationToken)
	{
		return await _service.GetInvoiceDetails(request);
	}
}
