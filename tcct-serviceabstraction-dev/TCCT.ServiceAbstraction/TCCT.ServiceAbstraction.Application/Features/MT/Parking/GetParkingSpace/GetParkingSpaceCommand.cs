using System;
using TCCT.ServiceAbstraction.Application.Configuration.Commands;

namespace TCCT.ServiceAbstraction.Application.Features.MT.Parking.GetParkingSpace;

public class GetParkingSpaceCommand : ICommand<List<GetParkingSpaceResult>>
{
    public string? parkSyscode { get; set; }
    public string? spaceNo { get; set;}
    public int? state { get; set; }
		public string? bindCars { get; set; }
		public int? pageNo { get; set; }
		public int? pageSize { get; set; }
		public string? plateNo { get; set; }
}
