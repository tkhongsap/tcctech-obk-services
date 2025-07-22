namespace TCCT.ServiceAbstraction.Application.Features.EV.Query.GetInvoices;

public class GetInvoicesResult
{
    public List<InvoiceResult>? invoice { get; set; }
    public bool? completed { get; set; }
    public string? message { get; set; }
    public int? errCode { get; set; }
}

public class InvoiceResult
{
    public string? uuid { get; set; }
    public string? number { get; set; }
    public string? expense { get; set; }
    public InvoicePreview? preview { get; set; }
    public InvoiceReceipt? receipt { get; set; }
    public string? status { get; set; }
    public bool? overdue { get; set; }
    public string? cancelled { get; set; }
}

public class InvoicePreview
{
    public string? date { get; set; }
    public string? due { get; set; }
}

public class InvoiceReceipt
{
    public string? uuid { get; set; }
    public string? number { get; set; }
}

