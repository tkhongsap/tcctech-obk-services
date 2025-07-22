using TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Model;

namespace TCCTOBK.OperationBackend.Application.Contracts.DataModel.TaskRepository;
public class CreateTaskModel
{
	public string Name { get; set; }

	public int StatusId { get; set; }

	public DateTime? StartDate { get; set; }

	public DateTime? EndDate { get; set; }

	public Guid LocationId { get; set; }

	public Guid MemberId { get; set; }

	public CreateTaskModel(string name, int status, DateTime? startDate, DateTime? endDate, Guid location, Guid member)
	{
		Name = name;
		StatusId = status;
		StartDate = startDate;
		EndDate = endDate;
		LocationId = location;
		MemberId = member;
	}
}
