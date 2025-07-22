namespace TCCT.ServiceAbstraction.Application.Features.EV.Query.GetSession;

public class GetSessionResult
{
    public Session? session { get; set; }
    public List<Option>? options { get; set; }
    public bool? completed { get; set; }
    public string? message { get; set; }
    public int? errcode { get; set; }
}

public class Session
{
    public string? uuid { get; set; }
    public string? state { get; set; }
    public object? invoice { get; set; }
    public bool? publish { get; set; }
    public Place? place { get; set; }
    public Charger? charger { get; set; }
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

public class Option
{
    public List<int>? fine { get; set; }
    public int? grace { get; set; }
    public bool? active { get; set; }
    public Energy? energy { get; set; }
    public List<int>? hourly { get; set; }
    public int? limited { get; set; }
    public List<string>? note { get; set; }
    public string? type { get; set; }
    public string? name { get; set; }
    public string? icon { get; set; }
}

public class Energy
{
    public string? peak { get; set; }
    public string? offpeak { get; set; }
    public object? limit { get; set; }
}

