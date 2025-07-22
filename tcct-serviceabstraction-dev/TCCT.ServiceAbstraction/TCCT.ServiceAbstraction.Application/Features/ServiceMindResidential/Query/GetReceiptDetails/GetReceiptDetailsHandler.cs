using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TCCT.ServiceAbstraction.Application.Configuration.Queries;
using TCCT.ServiceAbstraction.Application.Contracts.ServiceMindResidential;
using TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Query.GetInvoiceDetails;

namespace TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Query.GetReceiptDetails;
public class GetReceiptDetailsHandler : IQueryHandler<GetReceiptDetailsQuery, GetReceiptDetailsResult>
{
	private readonly IServiceMindResidential _service;
	public GetReceiptDetailsHandler(IServiceMindResidential service)
	{
		_service = service;
	}
	public async Task<GetReceiptDetailsResult> Handle(GetReceiptDetailsQuery request, CancellationToken cancellationToken)
	{
		return await _service.GetReceiptDetails(request);
	}
}
