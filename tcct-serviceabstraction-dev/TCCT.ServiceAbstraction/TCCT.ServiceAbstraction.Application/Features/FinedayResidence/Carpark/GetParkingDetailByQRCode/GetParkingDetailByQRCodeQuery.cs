using System;
using TCCT.ServiceAbstraction.Application.Configuration.Queries;

namespace TCCT.ServiceAbstraction.Application.Features.FinedayResidence.Carpark.GetParkingDetailByQRCode;

public class GetParkingDetailByQRCodeQuery : IQuery<GetParkingDetailByQRCodeResult>
{
    public string logCarparkID { get; set; }
    public bool lostCard { get; set; }
}
