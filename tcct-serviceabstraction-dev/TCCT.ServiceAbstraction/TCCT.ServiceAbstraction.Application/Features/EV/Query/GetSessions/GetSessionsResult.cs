using System.Text.Json.Serialization;

namespace TCCT.ServiceAbstraction.Application.Features.EV.Query.GetSessions;

public class GetSessionsResult
{
    public Summary? summary { get; set; }
    public object? pending { get; set; } 
    public List<Session>? session { get; set; }
    public bool? completed { get; set; }
    public string? message { get; set; }
    public int? errcode { get; set; }
}

public class Summary
{
    public string? activity { get; set; }
    public string? energy { get; set; }
    public string? duration { get; set; }
    public string? expense { get; set; }
}

public class Pending
{
    public string? uuid { get; set; }
    public string? state { get; set; }
    public Invoice? invoice { get; set; }
    public bool? publish { get; set; }
    public Place? place { get; set; }
    public Business? business { get; set; }
    public Charger? charger { get; set; }
}

public class Invoice
{
    public string? uuid { get; set; }
    public string? number { get; set; }
}

public class Place
{
    public string? name { get; set; }
    public string? uuid { get; set; }
    public Coordinates? coord { get; set; }
}

public class Coordinates
{
    public double? lat { get; set; }
    public double? lng { get; set; }
}

public class Business
{
    public string? name { get; set; }
    public string? uuid { get; set; }
    public Contact? contact { get; set; }
    public bool? logo { get; set; }
}

public class Contact
{
    public string? email { get; set; }
    public string? phone { get; set; }
    public string? website { get; set; }
}

public class Charger
{
    public string? model { get; set; }
    public Electric? electric { get; set; }
    public string? identity { get; set; }
    public string? manufacturer { get; set; }
    public Connector? connector { get; set; }
}

public class Electric
{
    public int? phase { get; set; }
    public int? power { get; set; }
    public int? energy { get; set; }
    public double? standby { get; set; }
    public int? voltage { get; set; }
}

public class Connector
{
    public string? code { get; set; }
    public string? name { get; set; }
    public Electric? electric { get; set; }
}

public class Session
{
    public string? uuid { get; set; }
    public string? state { get; set; }
    public string? txn { get; set; }
    public string? duration { get; set; }
    public bool? fined { get; set; }
    public string? type { get; set; }
    public Charger? charger { get; set; }
    public SessionSummary? summary { get; set; }
}

public class SessionSummary
{
    public PriceQuantity? energy { get; set; }
    public PriceQuantity? duration { get; set; }
    public PriceQuantity? fine { get; set; }
    public string? vat { get; set; }
    public string? total { get; set; }
}

public class PriceQuantity
{
    public string? price { get; set; }
    public string? quantity { get; set; }
}

