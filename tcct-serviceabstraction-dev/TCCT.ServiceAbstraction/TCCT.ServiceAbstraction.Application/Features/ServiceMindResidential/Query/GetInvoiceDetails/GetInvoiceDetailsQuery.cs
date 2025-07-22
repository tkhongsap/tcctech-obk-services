using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TCCT.ServiceAbstraction.Application.Configuration.Queries;

namespace TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Query.GetInvoiceDetails;
public class GetInvoiceDetailsQuery : IQuery<GetInvoiceDetailsResult>
{
	public string? TenantId { get; set; } = null!;
	public string? InvoiceId { get; set; } = null!;

	public GetInvoiceDetailsQuery(string? tenantId, string? invoiceId)
	{
		TenantId = tenantId;
		InvoiceId = invoiceId;
	}
}
