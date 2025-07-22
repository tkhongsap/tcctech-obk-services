using System;
using TCCT.ServiceAbstraction.Application.Configuration.Commands;

namespace TCCT.ServiceAbstraction.Application.Features.MT.Parking.GetParkingQuery;

public class GetParkingQueryCommand : ICommand<GetParkingQueryResult>
{
    public int? queryType { get; set; }
    public string? parkSyscode { get; set; }
    public string? plateNo { get; set; }
    public string? spaceNo { get; set; }
    public string? startTime { get; set; }
    public string? endTime { get; set; }
    public int? pageNo { get; set; }
    public int? pageSize { get; set; }
}