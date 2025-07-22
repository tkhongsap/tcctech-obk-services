using TCCT.ServiceAbstraction.Application.Configuration.Commands;
namespace TCCT.ServiceAbstraction.Application.Features.FinedayResidence.Redemption.RedeemParking;

public class RedeemParkingCommand : ICommand<RedeemParkingResult>
{
    public string logCarparkID { get; set; }
    public int terminalID { get; set; }
    public string datetimeIn { get; set; }
    public string runningNumber { get; set; }
    public string plateNumber { get; set; }
    public int memberType { get; set; }
    public int carType { get; set; }
    public int tenantID { get; set; }
    public int rateCode { get; set; }
    public int userID { get; set; }
    public string remark { get; set; }
}
