namespace TCCT.ServiceAbstraction.Application.Features.FinedayResidence.Residence.GetDataResidenceAuthorizeFloorMaster;
public class GetDataResidenceAuthorizeFloorMasterResult {
    public int residenceID { get; set; }
    public int floorID { get; set; }
    public List<TowerData> towerList { get; set; }
}

public class TowerData
{
    public int towerID { get; set; }
    public List<AuthorizeFloorData> authorizeFloor { get; set; }
}

public class AuthorizeFloorData
{
    public int zoneID { get; set; }
    public int floorID { get; set; }
    public int locationID { get; set; }
}
