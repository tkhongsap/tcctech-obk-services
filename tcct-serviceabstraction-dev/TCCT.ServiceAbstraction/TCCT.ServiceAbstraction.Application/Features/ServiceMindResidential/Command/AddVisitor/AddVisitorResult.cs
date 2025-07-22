namespace TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Command.AddVisitor;
public class AddVisitorResult
{
	public string? message { get; set; }
	public VisitorPass data { get; set; } = new VisitorPass();
}

public class VisitorPass
{
	public string? id { get; set; }
	public string? orgId { get; set; }
	public string? companyId { get; set; }
	public bool isActive { get; set; }
	public int sourceOfRequest { get; set; }
	public string? qrCodeData { get; set; }
	public string? createdBy { get; set; }
	public string createdAt { get; set; }
	public string updatedAt { get; set; }
	public string? updatedBy { get; set; }
	public VisitorPassDetails details { get; set; } = new VisitorPassDetails();
	public AccessLocation accessLocation { get; set; } = new AccessLocation();
	public AccessTimeConfig accessTimeConfig { get; set; } = new AccessTimeConfig();
	public AccessTime accessTime { get; set; } = new AccessTime();
}

public class VisitorPassDetails
{
	public string? id { get; set; }
	public string? orgId { get; set; }
	public string? visitorPassId { get; set; }
	public string? name { get; set; }
	public string? email { get; set; }
	public string? idNumber { get; set; }
}

public class AccessLocation
{
	public string? id { get; set; }
	public string? orgId { get; set; }
	public string? visitorPassId { get; set; }
	public string? buildingId { get; set; }
	public string? unitId { get; set; }
	public string? floorId { get; set; }
	public string? residentId { get; set; }
}

public class AccessTimeConfig
{
	public string? id { get; set; }
	public string? orgId { get; set; }
	public string? visitorPassId { get; set; }
	public RepeatConfigData repeatConfig { get; set; } = new RepeatConfigData();
	public TimeConfigData timeConfig { get; set; } = new TimeConfigData();
}

public class RepeatConfigData
{
	public bool isRepeat { get; set; }
	public int? type { get; set; }
	public int? date { get; set; }
	public List<string>? days { get; set; }
	public string? endDate { get; set; }
}

public class TimeConfigData
{
	public bool isSpecific { get; set; }
	public string? start { get; set; }
	public string? end { get; set; }
}

public class AccessTime
{
	public string? id { get; set; }
	public string? orgId { get; set; }
	public string? visitorPassId { get; set; }
	public string? accessTimeConfigId { get; set; }
	public string? visitDate { get; set; }
	public string? visitStartTime { get; set; }
	public string? visitEndTime { get; set; }
}
