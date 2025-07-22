namespace TCCTOBK.OperationBackend.Application.Features.Operation.Cases.Command.UpsertCases;

public class UpsertCasesResult
{
	public bool IsSuccess { get; set; } = true;
	public string Message { get; set; } = "Success";
	public int Count { get; set; }
}
