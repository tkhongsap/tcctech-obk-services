using TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Model;

namespace TCCTOBK.OperationBackend.Application.Contracts.DataModel.SubtaskRepository;
public class CreateSubtaskModel
{
	public string Name { get; set; }
	public int StatusId { get; set; }
	public List<Guid> ActionIds { get; set; }
	public CreateSubtaskModel(string name, int statusId, List<Guid> actionIds)
	{
		Name = name;
		StatusId = statusId;
		ActionIds = actionIds;
	}
}
