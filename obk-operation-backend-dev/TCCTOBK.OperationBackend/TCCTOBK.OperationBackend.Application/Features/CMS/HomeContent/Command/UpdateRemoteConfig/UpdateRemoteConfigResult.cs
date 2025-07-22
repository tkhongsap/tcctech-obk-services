namespace TCCTOBK.OperationBackend.Application;

public class UpdateRemoteConfigResult
{
	public bool IsSuccess { get; set; } = true;
	public string Message { get; set; } = "Success";
	public string? Version { get; set; } = default!;
}
