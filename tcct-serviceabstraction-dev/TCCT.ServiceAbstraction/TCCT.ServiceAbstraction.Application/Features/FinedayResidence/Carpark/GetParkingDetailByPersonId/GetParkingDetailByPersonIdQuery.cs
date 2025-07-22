using System;
using TCCT.ServiceAbstraction.Application.Configuration.Queries;

namespace TCCT.ServiceAbstraction.Application.Features.FinedayResidence.Carpark.GetParkingDetailByPersonId;

public class GetParkingDetailByPersonIdQuery : IQuery<GetParkingDetailByPersonIdResult>
{
    public Guid personID { get; set; }
    public bool lostCard { get; set; }
}
