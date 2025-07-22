namespace TCCT.ServiceAbstraction.Application.Features.EV.Query.GetPlace;

public class PlaceResult
{
    public Place? place { get; set; }
    public bool? completed { get; set; }
    public string? message { get; set; }
    public int? errcode { get; set; }
}

public class Place
{
    public string? uuid { get; set; }
    public string? name { get; set; }
    public Description? description { get; set; }
    public int? connectors { get; set; }
    public string? timezone { get; set; }
    public bool? available { get; set; }
    public bool? maintenance { get; set; }
    public Coordinates? coords { get; set; }
    public Facility? facility { get; set; }
    public Country? country { get; set; }
    public Business? business { get; set; }
    public State? state { get; set; }
    public List<Operation>? operation { get; set; }
    public Price? price { get; set; }
    public Visibility? visibility { get; set; }
    public bool? reservable { get; set; }
    public List<Reservation>? reservation { get; set; }
    public Issued? issued { get; set; }
    public List<Building>? building { get; set; }
    public Connector? connector { get; set; }
}

public class Description
{
    public string? text { get; set; }
    public string? shortText { get; set; }
}

public class Coordinates
{
    public double? lat { get; set; }
    public double? lng { get; set; }
}

public class Facility { }

public class Country
{
    public string? code { get; set; }
    public string? dial { get; set; }
    public string? name { get; set; }
    public string? number { get; set; }
}

public class Business
{
    public string? name { get; set; }
    public string? uuid { get; set; }
    public string? account { get; set; }
    public bool? logo { get; set; }
    public bool? agreement { get; set; }
}

public class State
{
    public bool? open { get; set; }
    public string? text { get; set; }
}

public class Operation
{
    public string? key { get; set; }
    public bool? open { get; set; }
    public OperationTime? time { get; set; }
}

public class OperationTime
{
    public string? open { get; set; }
    public string? close { get; set; }
}

public class Price
{
    public string? energy { get; set; }
    public string? parking { get; set; }
}

public class Visibility
{
    public string? uuid { get; set; }
    public string? name { get; set; }
    public string? type { get; set; }
}

public class Reservation
{
    public string? date { get; set; }
    public string? start { get; set; }
    public int? slot { get; set; }
    public bool? active { get; set; }
    public string? end { get; set; }
}

public class Issued
{
    public string? date { get; set; }
    public string? name { get; set; }
}

public class Building
{
    public string? uuid { get; set; }
    public string? name { get; set; }
    public bool? maintenance { get; set; }
    public Coordinates? coords { get; set; }
    public List<Operation>? operation { get; set; }
    public State? state { get; set; }
    public Connectors? connectors { get; set; }
    public Business? business { get; set; }
    public Place? place { get; set; }
    public int? floors { get; set; }
    public int? room { get; set; }
    public Issued? issued { get; set; }
}

public class Connectors
{
    public int? available { get; set; }
    public int? busy { get; set; }
    public int? unavailable { get; set; }
    public List<object>? list { get; set; }
}

public class Connector
{
    public int? available { get; set; }
    public int? busy { get; set; }
    public int? unavailable { get; set; }
    public List<object>? list { get; set; }
}

