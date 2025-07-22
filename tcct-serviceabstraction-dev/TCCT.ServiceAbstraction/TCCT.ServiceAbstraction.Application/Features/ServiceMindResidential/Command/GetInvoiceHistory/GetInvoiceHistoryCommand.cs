using TCCT.ServiceAbstraction.Application.Configuration.Commands;

namespace TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Command.GetInvoiceHistory;
public class GetInvoiceHistoryCommand : ICommand<GetInvoiceHistoryResult>
{
	public string TenantId { get; set; }
	public int PerPage { get; set; } = 10;
	public int CurrentPage { get; set; } = 1;
	public FilterGetLatestMeterReading? Filter { get; set; }
}


public class FilterGetLatestMeterReading
{
	public string? invoiceGroup { get; set; }
	public List<int>? PropertyUnitIds { get; set; }
}
