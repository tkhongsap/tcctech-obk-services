using System;
using System.Windows.Input;
using TCCT.ServiceAbstraction.Application.Configuration.Commands;

namespace TCCT.ServiceAbstraction.Application.Features.FinedayResidence.AuthorizeFloor.ChangeDefaultFloor;

public class ChangeDefaultFloorCommand : ICommand<ChangeDefaultFloorResult>
{
    public int floorID { get; set; }
    public int zoneID { get; set; }
    public Guid personID { get; set; }
}
