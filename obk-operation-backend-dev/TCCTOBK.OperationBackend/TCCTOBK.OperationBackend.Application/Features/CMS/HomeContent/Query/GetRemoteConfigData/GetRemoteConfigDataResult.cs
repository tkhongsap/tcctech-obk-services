namespace TCCTOBK.OperationBackend.Application;

public class GetRemoteConfigDataResult
{
	public bool IsSuccess { get; set; } = true;
	public string data { get; set; } = default!;
}
