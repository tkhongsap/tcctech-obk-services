namespace TCCTOBK.OperationBackend.Application.Features.Operation.PPM.Command.UpsertPPM;

public class UpsertPPMResult
{
	public bool IsSuccess { get; set; } = true;
	public string Message { get; set; } = "Success";
	public int Count { get; set; }
}
