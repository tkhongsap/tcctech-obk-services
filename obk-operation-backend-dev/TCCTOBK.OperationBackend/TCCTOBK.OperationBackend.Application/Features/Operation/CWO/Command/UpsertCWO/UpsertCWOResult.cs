namespace TCCTOBK.OperationBackend.Application.Features.Operation.CWO.Command.UpsertCWO;

public class UpsertCWOResult
{
	public bool IsSuccess { get; set; } = true;
	public string Message { get; set; } = "Success";
	public int Count { get; set; }
}
