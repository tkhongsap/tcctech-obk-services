using System;
using TCCT.ServiceAbstraction.Application.Configuration.Commands;

namespace TCCT.ServiceAbstraction.Application.Features.MT.Parking.GetParkingDetailByPersonId;

public class GetParkingDetailByPersonIdCommand : ICommand<GetParkingDetailByPersonIdResult>
{
    public Guid personID { get; set; }
    public bool lostCard { get; set; }
}