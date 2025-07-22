using System;

namespace TCCT.ServiceAbstraction.Application.Features.FinedayResidence.LocationMapping.GetResidenceLocationMapping;

public class GetResidenceLocationMappingResult
{
    public int locationID { get; set; }
    public string locationName { get; set; }
    public string locationNameThai { get; set; }
    public int projectID { get; set; }
    public string projectName { get; set; }
    public int towerID { get; set; }
    public string towerName { get; set; }
    public int zoneID { get; set; }
    public string zoneName { get; set; }
    public string zoneNameThai { get; set; }
    public int floorID { get; set; }
    public string floorName { get; set; }
    public bool active { get; set; }
}
