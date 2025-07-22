using MediatR;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.UsageMonitoring.Roster.Command.UpsertRoster;

public class UpsertRosterCommand : IRequest<string>
{
	public Guid? Id { get; set; }
	public string? Component { get; set; }
	public string LocationCode { get; set; } = "";
	public int? WeekDay { get; set; }
	public int? WeekEnd { get; set; }
	public bool IsActive { get; set; } = true;
	public DateTime? StartDateTime { get; set; }
	public DateTime? EndDateTime { get; set; }
}
