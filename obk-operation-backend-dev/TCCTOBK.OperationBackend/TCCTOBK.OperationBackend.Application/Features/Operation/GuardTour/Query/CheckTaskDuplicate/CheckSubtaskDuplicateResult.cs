using System;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Query.CheckSubtaskDuplicate;

public class CheckTaskDuplicateResult
{
	public string? Message { get; set; }

	public CheckTaskDuplicateResult(string? message)
	{
		Message = message;
	}
}
