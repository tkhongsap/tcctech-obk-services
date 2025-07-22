namespace TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Query.GetCarParkingQuota;

public class GetCarParkingQuotaResult {
   public GetCarParkingQuotaCombined parkingQuotaCombined { get; set; }
}

public class GetCarParkingQuotaCombined
{
    public List<string> propertyUnitIds { get; set; }
    public List<string> unitNumbers { get; set; }
    public ParkingQuotaDetail fixedEvNormal { get; set; }
    public ParkingQuotaDetail fixedEvSupercar { get; set; }
    public ParkingQuotaDetail fixedNonEvNormal { get; set; }
    public ParkingQuotaDetail fixedNonEvSupercar { get; set; }
    public FloatParkingQuotaDetail floatNonEvNormal { get; set; }
}

public class ParkingQuotaDetail
{
    public int count { get; set; }
    public List<int> lots { get; set; }
}

public class FloatParkingQuotaDetail
{
    public int count { get; set; }
}
