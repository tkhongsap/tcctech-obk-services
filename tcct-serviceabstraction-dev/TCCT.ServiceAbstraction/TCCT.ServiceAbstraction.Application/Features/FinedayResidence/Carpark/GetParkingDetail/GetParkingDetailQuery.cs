using System;
using TCCT.ServiceAbstraction.Application.Configuration.Queries;

namespace TCCT.ServiceAbstraction.Application.Features.FinedayResidence.Carpark.GetParkingDetail;

public class GetParkingDetailQuery : IQuery<GetParkingDetailResult>
{
    public string search { get; set; }
    public bool lostCard { get; set; }
}
