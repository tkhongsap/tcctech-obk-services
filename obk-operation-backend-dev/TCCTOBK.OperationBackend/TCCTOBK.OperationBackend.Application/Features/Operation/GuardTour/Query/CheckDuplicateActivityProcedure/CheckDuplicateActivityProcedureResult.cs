using System;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Query.CheckDuplicateActivityProcedure;

public class CheckDuplicateActivityProcedureResult
{
	public string? Message { get; set; }

	public CheckDuplicateActivityProcedureResult(string? message)
	{
		Message = message;
	}
}
