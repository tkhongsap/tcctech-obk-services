using System;
using MediatR;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.Cases.Command.UpdateTask;

public class UpdateTaskCommand : IRequest<UpdateTaskResult>
{
  public int CaseId { get; set; }
  public int Id { get; set; }
  public string Name { get; set; }
  public int StatusCode { get; set; }
  public bool IsCritical { get; set; }
  public int TaskCategoryId { get; set; }
  public int? AssignedStaffId { get; set; }
  public string? AssignedStaffDisplayName { get; set; }
  public string? CreatedBy { get; set; }
  public string? CreatedOn { get; set; }
  public int? Sequence { get; set; }
  public List<string> ImageBase64 { get; set; }
}
