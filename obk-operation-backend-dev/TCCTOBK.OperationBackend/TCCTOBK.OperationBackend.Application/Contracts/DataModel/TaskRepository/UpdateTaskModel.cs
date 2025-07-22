using TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Model;

namespace TCCTOBK.OperationBackend.Application.Contracts.DataModel.TaskRepository;
public class UpdateTaskModel
{
	public Guid TID { get; set; }
	public string? Name { get; set; }

	public int StatusId { get; set; }

	public DateTime? StartDate { get; set; }

	public DateTime? EndDate { get; set; }

	public Guid LocationId { get; set; } = Guid.Empty;

	public Guid MemberId { get; set; } = Guid.Empty;

	public DateTime? CompleteDate { get; set; }
	public Boolean? IsLate { get; set; }
	public DateTime? AcknowledgeDate { get; set; }
	public string? CancelReason { get; set; }
	public UpdateTaskModel(Guid tid, string? name, int status, DateTime? startDate, DateTime? endDate, Guid location, Guid member, DateTime? completeDate, Boolean? isLate, DateTime? acknowledgeDate, string? cancelReason = null)
	{
		TID = tid;
		Name = name;
		StatusId = status;
		StartDate = startDate;
		EndDate = endDate;
		LocationId = location;
		MemberId = member;
		CompleteDate = completeDate;
		IsLate = isLate;
		AcknowledgeDate = acknowledgeDate;
		CancelReason = cancelReason;
	}
}
