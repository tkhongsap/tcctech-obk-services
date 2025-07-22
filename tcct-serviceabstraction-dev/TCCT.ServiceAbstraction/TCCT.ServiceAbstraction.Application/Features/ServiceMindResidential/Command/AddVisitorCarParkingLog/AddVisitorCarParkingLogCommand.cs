using TCCT.ServiceAbstraction.Application.Configuration.Commands;

namespace TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Command.AddVisitorCarParkingLog;
public class AddVisitorCarParkingLogCommand : ICommand<AddVisitorCarParkingLogResult>
{
	public string PersonId { get; set; }
	public string InviteId { get; set; }
	public string FirstName { get; set; }
	public string LastName { get; set; }
	public string LicensePlateNumber { get; set; }
	public string Event { get; set; }
	public DateTime EventDateTime { get; set; }
}