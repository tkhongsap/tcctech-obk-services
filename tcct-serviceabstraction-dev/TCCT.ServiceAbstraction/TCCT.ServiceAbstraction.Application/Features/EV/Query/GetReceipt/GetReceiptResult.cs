namespace TCCT.ServiceAbstraction.Application.Features.EV.Query.GetReceipt;

public class GetReceiptResult
{
    public Receipt? receipt { get; set; }
    public bool? completed { get; set; }
    public string? message { get; set; }
    public int? errcode { get; set; }
}

public class Receipt
{
    public string? uuid { get; set; }
    public string? number { get; set; }
    public string? invoice { get; set; }
    public Payment? payment { get; set; }
    public List<Order>? orders { get; set; }
    public string? date { get; set; }
    public Total? total { get; set; }
    public Summary? summary { get; set; }
    public Business? business { get; set; }
}

public class Payment
{
    public string? vat { get; set; }
    public string? uuid { get; set; }
    public string? price { get; set; }
    public string? method { get; set; }
    public string? number { get; set; }
    public string? total { get; set; }
}

public class Total
{
    public string? en { get; set; }
    public string? th { get; set; }
}

public class Order
{
    public string? uuid { get; set; }
    public Product? product { get; set; }
    public Summary? summary { get; set; }
    public string? unit { get; set; }
    public int? quantity { get; set; }
    public bool? cancelled { get; set; }
}

public class Product
{
    public string? name { get; set; }
    public string? uuid { get; set; }
}

public class Summary
{
    public string? total { get; set; }
    public string? price { get; set; }
    public string? each { get; set; }
    public string? vat { get; set; }
    public string? cost { get; set; }
    public string? subtotal { get; set; }
    public string? pretax { get; set; }
}

public class Business
{
    public string? uuid { get; set; }
    public string? tin { get; set; }
    public string? name { get; set; }
    public Address? address { get; set; }
    public string? email { get; set; }
    public Phone? phone { get; set; }
    public string? website { get; set; }
}

public class Address
{
    public string? city { get; set; }
    public string? text { get; set; }
    public string? zipcode { get; set; }
    public string? province { get; set; }
    public string? country { get; set; }
}

public class Phone
{
    public string? dial { get; set; }
    public long? number { get; set; }
}

