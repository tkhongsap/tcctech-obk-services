using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TCCT.ServiceAbstraction.Application.Configuration.Queries;
using TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Query.GetInvoiceDetails;

namespace TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Query.GetReceiptDetails;
public class GetReceiptDetailsQuery : IQuery<GetReceiptDetailsResult>
{
	public string? TenantId { get; set; } = null!;
	public string? ReceiptId { get; set; } = null!;

	public GetReceiptDetailsQuery(string? tenantId, string? receiptId)
	{
		TenantId = tenantId;
		ReceiptId = receiptId;
	}
}
