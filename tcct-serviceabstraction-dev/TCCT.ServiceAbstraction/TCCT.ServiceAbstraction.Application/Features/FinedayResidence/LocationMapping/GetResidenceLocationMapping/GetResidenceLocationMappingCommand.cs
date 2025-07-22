using TCCT.ServiceAbstraction.Application.Configuration.Queries;

namespace TCCT.ServiceAbstraction.Application.Features.FinedayResidence.LocationMapping.GetResidenceLocationMapping;

public class GetResidenceLocationMappingQuery : IQuery<List<GetResidenceLocationMappingResult>>
{
    public int zoneID { get; set; }
    public int floorID { get; set; }
}
