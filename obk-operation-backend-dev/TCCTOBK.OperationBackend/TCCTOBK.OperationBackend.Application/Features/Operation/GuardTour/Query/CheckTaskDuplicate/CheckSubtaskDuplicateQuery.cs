using System;
using TCCTOBK.OperationBackend.Application.Configuration.Queries;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Query.CheckSubtaskDuplicate;

public class CheckTaskDuplicateQuery : IQuery<CheckTaskDuplicateResult>
{
	public Guid? Id { get; set; }
	public string Name { get; set; } = default!;
}
