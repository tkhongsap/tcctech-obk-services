using TCCTOBK.OperationBackend.Application.Configuration.Commands;

namespace TCCTOBK.OperationBackend.Application.Features.Mobile.SOC.Command.CreateCaseIncident;
public class CreateCaseIncidentCommand : ICommand<CreateCaseIncidentResult>
{
	public int LocationId { get; set; }
	public int EventTypeId { get; set; }
	public string? ShortDesc { get; set; }
	public string? Requester { get; set; }
}
