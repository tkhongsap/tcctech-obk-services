using MediatR;
using TCCTOBK.OperationBackend.Application.Contracts.DataModel.SubtaskRepository;
using TCCTOBK.OperationBackend.Application.Helper.Auditable;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Command.CreateTaskSubtask;

public class CreateTaskSubtaskCommand : AuditableModel, IRequest<CreateTaskSubtaskResult>
{	
	public string Name { get; set; }
	public int StatusId { get; set; }
	public DateTime? StartDate { get; set; }
	public DateTime? EndDate { get; set; }
	public Guid LocationId { get; set; }
	public Guid MemberId { get; set; }
	public List<CreateSubtaskModel> Subtasks { get; set; } = new List<CreateSubtaskModel>();
}
