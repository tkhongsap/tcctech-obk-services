namespace TCCT.ServiceAbstraction.Application.Features.EV.Query.GetReserve;

public class GetReserveResult
{
    public ReservationDetail? reservation { get; set; }
    public bool? completed { get; set; }
    public string? message { get; set; }
    public int? errcode { get; set; }
}

public class ReservationDetail
{
    public string? uuid { get; set; }
    public bool? invoice { get; set; }
    public bool? session { get; set; }
    public string? state { get; set; }
    public int? duration { get; set; }
    public string? number { get; set; }
    public DateTime? started { get; set; }
    public DateTime? expired { get; set; }
    public bool? chargable { get; set; }
    public Customer? customer { get; set; }
    public Place? place { get; set; }
    public Building? building { get; set; }
    public ReservationData? data { get; set; }
    public Business? business { get; set; }
    public Charger? charger { get; set; }
    public Issued? issued { get; set; }
}

public class Customer
{
    public string? name { get; set; }
    public string? uuid { get; set; }
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

public class Building { }

public class ReservationData
{
    public decimal? price { get; set; }
    public bool? applied { get; set; }
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
    public string? uuid { get; set; }
    public string? model { get; set; }
    public Electric? electric { get; set; }
    public string? identity { get; set; }
    public string? manufacturer { get; set; }
    public Connector? connector { get; set; }
}

public class Electric
{
    public int? phase { get; set; }
    public decimal? power { get; set; }
    public decimal? energy { get; set; }
    public decimal? standby { get; set; }
    public decimal? voltage { get; set; }
}

public class Connector
{
    public string? code { get; set; }
    public string? name { get; set; }
    public Electric? electric { get; set; }
}

public class Issued
{
    public DateTime? date { get; set; }
    public string? name { get; set; }
}

