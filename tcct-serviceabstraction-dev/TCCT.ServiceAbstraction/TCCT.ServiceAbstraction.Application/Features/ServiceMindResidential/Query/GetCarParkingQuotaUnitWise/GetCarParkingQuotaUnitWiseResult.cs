namespace TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Query.GetCarParkingQuotaUnitWise;

public class GetCarParkingQuotaUnitWiseResult
{
    public List<GetCarParkingQuotaUnitWiseResultData> parkingQuotaGrouped { get; set; }
}
public class GetCarParkingQuotaUnitWiseResultData
{
    public string propertyUnitId { get; set; }
    public string unitNumber { get; set; }
    public ParkingType fixedEvNormal { get; set; }
    public ParkingType fixedEvSupercar { get; set; }
    public ParkingType fixedNonEvNormal { get; set; }
    public ParkingType fixedNonEvSupercar { get; set; }
    public ParkingType floatNonEvNormal { get; set; }
}

public class ParkingType
{
    public int count { get; set; }
    public List<int> lots { get; set; }
}
