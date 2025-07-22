using TCCT.ServiceAbstraction.Application.Configuration.Commands;

namespace TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Command.SaveLogs;
public class SaveLogsCommand : ICommand<SaveLogsResult>
{
	public string TenantId { get; set; }
	public string LogType { get; set; }
	public object? LogData { get; set; }
}