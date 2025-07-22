namespace TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Command.SaveLogs;
public class SaveLogsResult
{
	public string? orgId { get; set; }
	public string? id { get; set; }
	public string? logType { get; set; }
	public string? tenantId { get; set; }
	public object? logData { get; set; }
	public string? createdAt { get; set; }
}