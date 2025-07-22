namespace TCCT.ServiceAbstraction.Application.Features.EV.Query.GetInvoice;

public class GetInvoiceResult
{
    public InvoiceResult? invoice { get; set; }
    public bool? completed { get; set; }
    public string? message { get; set; }
    public int? errorCode { get; set; }
}

public class InvoiceResult
{
    public string? uuid { get; set; }
    public string? number { get; set; }
    public string? expense { get; set; }
    public InvoicePreview? preview { get; set; }
    public string? status { get; set; }
    public bool? overdue { get; set; }
    public string? cancelled { get; set; }
    public InvoiceSummary? summary { get; set; }
    public List<InvoiceOrder>? orders { get; set; }
    public List<InvoicePayment>? payments { get; set; }
    public InvoiceBusiness? business { get; set; }
}

public class InvoicePreview
{
    public string? date { get; set; }
    public string? due { get; set; }
}

public class InvoiceSummary
{
    public string? subtotal { get; set; }
    public string? vat { get; set; }
    public string? pretax { get; set; }
    public string? total { get; set; }
}

public class InvoiceOrder
{
    public string? uuid { get; set; }
    public InvoiceProduct? product { get; set; }
    public InvoiceOrderSummary? summary { get; set; }
    public string? unit { get; set; }
    public decimal? quantity { get; set; }
    public string? cancelled { get; set; }
}

public class InvoiceProduct
{
    public string? name { get; set; }
    public string? uuid { get; set; }
}

public class InvoiceOrderSummary
{
    public string? total { get; set; }
    public string? price { get; set; }
    public string? each { get; set; }
    public string? vat { get; set; }
    public string? cost { get; set; }
}

public class InvoicePayment
{
    public string? uuid { get; set; }
    public string? reference { get; set; }
    public string? price { get; set; }
    public string? vat { get; set; }
    public string? method { get; set; }
    public string? completed { get; set; }
}

public class InvoiceBusiness
{
    public string? uuid { get; set; }
    public string? account { get; set; }
    public string? name { get; set; }
    public InvoiceBusinessLegal? legal { get; set; }
}

public class InvoiceBusinessLegal
{
    public string? uuid { get; set; }
    public string? tin { get; set; }
    public string? name { get; set; }
    public InvoiceAddress? address { get; set; }
    public string? email { get; set; }
    public string? phone { get; set; }
    public string? website { get; set; }
    public bool? failed { get; set; }
    public bool? verified { get; set; }
}

public class InvoiceAddress
{
    public string? city { get; set; }
    public string? text { get; set; }
    public string? zipcode { get; set; }
    public string? province { get; set; }
    public string? country { get; set; }
}

