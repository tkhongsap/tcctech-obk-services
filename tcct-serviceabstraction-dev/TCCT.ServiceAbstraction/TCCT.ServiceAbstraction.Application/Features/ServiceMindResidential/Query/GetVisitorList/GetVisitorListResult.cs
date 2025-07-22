namespace TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Query.GetVisitorList;

public class GetVisitorListResult {
   public GetVisitorListPaginateResponse paginate { get; set; } = new();
   public List<GetVisitorListResultData> data { get; set; } = new();
}

public class GetVisitorListResultData
{
   public string? id { get; set; }
   public string? orgId { get; set; }
   public string? companyId { get; set; }
   public bool? isActive { get; set; }
   public int? sourceOfRequest { get; set; }
   public string? createdBy { get; set; }
   public string? createdAt { get; set; }
   public string? updatedAt { get; set; }
   public string? updatedBy { get; set; }
   public string? thirdPartyApiLogId { get; set; }
   public string? visitorScheduleId { get; set; }
   public string? residenceId { get; set; }
   public string? name { get; set; }
   public string? email { get; set; }
   public string? idNumber { get; set; }
   public string? buildingId { get; set; }
   public string? unitId { get; set; }
   public string? floorId { get; set; }
   public string? residentId { get; set; }
   public RepeatConfig? repeatConfig { get; set; }
   public TimeConfig? timeConfig { get; set; }
   public string? createdByName { get; set; }
   public string? date { get; set; }
   public string? isExpired { get; set; }
   public string? building { get; set; }
   public string? unit { get; set; }
   public string? floor { get; set; }
   public string? isRepeat { get; set; }
   public string? sqNo { get; set; }
   public string? elevatorName { get; set; }
   public string? zoneNameEn { get; set; }
   public string? zoneNameTh { get; set; }
}

public class RepeatConfig
{
   public bool? isRepeat { get; set; }
   public int? type { get; set; }
   public int? date { get; set; }
   public List<string> days { get; set; } = new();
   public string? endDate { get; set; }
}

public class TimeConfig
{
   public bool? isSpecific { get; set; }
   public string? start { get; set; }
   public string? end { get; set; }
}
public class GetVisitorListPaginateResponse
{
    public int total { get; set; }
    public int limit { get; set; }
    public int count { get; set; }
    public int page { get; set; }
}
