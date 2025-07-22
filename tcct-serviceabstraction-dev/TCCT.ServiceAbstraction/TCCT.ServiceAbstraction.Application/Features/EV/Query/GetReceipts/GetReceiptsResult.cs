namespace TCCT.ServiceAbstraction.Application.Features.EV.Query.GetReceipts;

public class GetReceiptsResult
{
    public List<Receipt> receipt { get; set; } = new List<Receipt>();
    public bool? completed { get; set; }
    public string? message { get; set; }
    public int? errcode { get; set; }
}

public class Receipt
{
    public string? uuid { get; set; }
    public string? number { get; set; }
    public Invoice? invoice { get; set; }
    public Payment? payment { get; set; }
    public Total? total { get; set; }
    public string? orders { get; set; }
    public string? date { get; set; }
}

public class Invoice
{
    public string? uuid { get; set; }
    public string? number { get; set; }
}

public class Payment
{
    public string? uuid { get; set; }
    public string? price { get; set; }
    public string? method { get; set; }
    public string? number { get; set; }
}

public class Total
{
    public string? en { get; set; }
    public string? th { get; set; }
}

