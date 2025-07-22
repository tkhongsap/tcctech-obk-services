namespace TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Model;
public class APSubtaskActionResult
{
	public string Name { get; set; } = null!;
	public List<Guid> Actions { get; set; } = new List<Guid>();
}
