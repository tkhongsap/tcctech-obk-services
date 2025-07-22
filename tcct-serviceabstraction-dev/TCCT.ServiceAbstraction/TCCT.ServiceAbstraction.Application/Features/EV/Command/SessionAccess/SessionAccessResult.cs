namespace TCCT.ServiceAbstraction.Application.Features.EV.Command.SessionAccess;

public class SessionAccessResult
{
    public bool? payment { get; set; }
    public bool? completed { get; set; }
    public string? message { get; set; }
    public int? errorCode { get; set; }
    public SessionAccessResultConnector? connector { get; set; }
}

public class SessionAccessResultConnector
{
    public string? code { get; set; }
    public string? name { get; set; }
    public SessionAccessResultConnectorCharger? charger { get; set; }
    public string? status { get; set; }
    public SessionAccessResultConnectorType? type { get; set; }
    public SessionAccessResultConnectorElectric? electric { get; set; }
    public string? session { get; set; }
    public SessionAccessResultConnectorOptions? options { get; set; }
}

public class SessionAccessResultConnectorCharger
{
    public string? identity { get; set; }
    public bool? online { get; set; }
    public SessionAccessResultConnectorChargerElectric? electric { get; set; }
}

public class SessionAccessResultConnectorChargerElectric
{
    public string? phase { get; set; }
    public string? power { get; set; }
    public string? energy { get; set; }
    public string? standby { get; set; }
    public string? voltage { get; set; }
}

public class SessionAccessResultConnectorType
{
    public string? name { get; set; }
    public string? key { get; set; }
}

public class SessionAccessResultConnectorElectric
{
    public string? type { get; set; }
    public string? energy { get; set; }
    public string? power { get; set; }
    public string? voltage { get; set; }
}

public class SessionAccessResultConnectorOptions
{
    public SessionAccessResultConnectorOptionsFully? fully { get; set; }
    public SessionAccessResultConnectorOptionsLimited? limited { get; set; }
    public SessionAccessResultConnectorOptionsReserve? reserve { get; set; }
    public SessionAccessResultConnectorOptionsSchedule? schedule { get; set; }
}

public class SessionAccessResultConnectorOptionsFully
{
    public string[]? fine { get; set; }
    public string? grace { get; set; }
    public bool? active { get; set; }
    public SessionAccessResultConnectorOptionsFullyEnergy? energy { get; set; }
    public string[]? hourly { get; set; }
    public bool? limited { get; set; }
    public SessionAccessResultConnectorOptionsFullyPreview? preview { get; set; }
}

public class SessionAccessResultConnectorOptionsFullyEnergy
{
    public string? peak { get; set; }
    public string? offPeak { get; set; }
}

public class SessionAccessResultConnectorOptionsFullyPreview
{
    public string? hourly { get; set; }
    public string? fine { get; set; }
}

public class SessionAccessResultConnectorOptionsLimited
{
    public string[]? fine { get; set; }
    public string? grace { get; set; }
    public bool? active { get; set; }
    public string? energy { get; set; }
    public SessionAccessResultConnectorOptionsLimitedPreview? preview { get; set; }
}

public class SessionAccessResultConnectorOptionsLimitedPreview
{
    public string? fine { get; set; }
}

public class SessionAccessResultConnectorOptionsReserve
{
    public string? price { get; set; }
    public bool? active { get; set; }
    public bool? applied { get; set; }
    public SessionAccessResultConnectorOptionsReservePreview? preview { get; set; }
    public string? grace { get; set; }
}

public class SessionAccessResultConnectorOptionsReservePreview
{
}

public class SessionAccessResultConnectorOptionsSchedule
{
    public string[]? fine { get; set; }
    public string? grace { get; set; }
    public bool? active { get; set; }
    public string[]? hourly { get; set; }
    public string? warning { get; set; }
    public SessionAccessResultConnectorOptionsSchedulePreview? preview { get; set; }
}

public class SessionAccessResultConnectorOptionsSchedulePreview
{
    public string? hourly { get; set; }
    public string? fine { get; set; }
}


