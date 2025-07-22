namespace TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Command.AddVisitorCarParkingLog;

public class AddVisitorCarParkingLogResult
{
    public string? orgId { get; set; }
    public string? id { get; set; }
    public string? tenantId { get; set; }
    public string? visitorPassId { get; set; }
    public Payload? payload { get; set; }
    public string? createdAt { get; set; }
}

public class Payload
{
    public string? @event { get; set; }
    public string? inviteId { get; set; }
    public string? lastName { get; set; }
    public string? personId { get; set; }
    public string? firstName { get; set; }
    public string? eventDateTime { get; set; }
    public string? licensePlateNumber { get; set; }
}

