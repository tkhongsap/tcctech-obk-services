namespace TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Command.GetInvoiceHistory;
public class GetInvoiceHistoryResult
{
    public int? total { get; set; }
    public int? per_page { get; set; }
    public int? offset { get; set; }
    public int? to { get; set; }
    public int? last_page { get; set; }
    public int? current_page { get; set; }
    public int? from { get; set; }
    public List<GetInvoiceData>? data { get; set; }
    public int? next_page { get; set; }
}

public class GetInvoiceData
{
    public string? invoiceId { get; set; }
    public string? invoiceGroup { get; set; }
    public string? invoiceNo { get; set; }
    public string? invoiceDate { get; set; }
    public string? status { get; set; }
    public string? grandTotalAmount { get; set; }
    public string? billMonth { get; set; }
    public string? billYear { get; set; }
    public GetInvoiceReceipt? receipt { get; set; }
}

public class GetInvoiceReceipt
{
    public int? id { get; set; }
    public int? invoiceId { get; set; }
    public int? invoicePaymentId { get; set; }
    public string? receiptNo { get; set; }
}
