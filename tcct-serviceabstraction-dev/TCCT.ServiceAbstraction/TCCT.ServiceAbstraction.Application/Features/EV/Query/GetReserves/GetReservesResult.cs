namespace TCCT.ServiceAbstraction.Application.Features.EV.Query.GetReserves;

public class GetReservesResult
{
    public List<ReservationResult?> reservation { get; set; }
    public bool? completed { get; set; }
    public string? message { get; set; }
    public int? errcode { get; set; }
}

public class ReservationResult
{
    public string? uuid { get; set; }
    public bool? invoice { get; set; }
    public bool? session { get; set; }
    public string? state { get; set; }
    public string? number { get; set; }
    public DateTime? started { get; set; }
    public DateTime? expired { get; set; }
    public DateTime? cancelled { get; set; }
    public PlaceResultReservation? place { get; set; }
    public BusinessResult? business { get; set; }
    public ChargerResult? charger { get; set; }
}

public class PlaceResultReservation
{
    public string? name { get; set; }
    public string? uuid { get; set; }
    public CoordinatesResult? coord { get; set; }
}

public class CoordinatesResult
{
    public double? lat { get; set; }
    public double? lng { get; set; }
}

public class BusinessResult
{
    public string? name { get; set; }
    public string? uuid { get; set; }
    public ContactResult? contact { get; set; }
    public bool? logo { get; set; }
}

public class ContactResult
{
    public string? email { get; set; }
    public string? phone { get; set; }
    public string? website { get; set; }
}

public class ChargerResult
{
    public string? uuid { get; set; }
    public string? model { get; set; }
    public ElectricResult? electric { get; set; }
    public string? identity { get; set; }
    public string? manufacturer { get; set; }
    public ConnectorResult? connector { get; set; }
}

public class ElectricResult
{
    public int? phase { get; set; }
    public int? power { get; set; }
    public int? energy { get; set; }
    public double? standby { get; set; }
    public int? voltage { get; set; }
}

public class ConnectorResult
{
    public string? code { get; set; }
    public string? name { get; set; }
    public ElectricResult? electric { get; set; }
}

