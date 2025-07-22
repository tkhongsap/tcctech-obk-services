using System.Text.Json.Serialization;
using MediatR;
using TCCTOBK.OperationBackend.Application.Contracts.DataModel.SubtaskRepository;
using TCCTOBK.OperationBackend.Application.Helper.Auditable;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Command.UpdateTaskSubtask;

public class UpdateTaskSubtaskCommand : AuditableModel, IRequest<UpdateTaskSubtaskResult>
{	
	public Guid TID { get; set; }
	public string? Name { get; set; }
	public int StatusId { get; set; }
	public DateTime? StartDate { get; set; }
	public DateTime? EndDate { get; set; }
	public Guid LocationId { get; set; }
	public Guid MemberId { get; set; }
	public List<CreateSubtaskModel> Subtasks { get; set; } = new List<CreateSubtaskModel>();
}
