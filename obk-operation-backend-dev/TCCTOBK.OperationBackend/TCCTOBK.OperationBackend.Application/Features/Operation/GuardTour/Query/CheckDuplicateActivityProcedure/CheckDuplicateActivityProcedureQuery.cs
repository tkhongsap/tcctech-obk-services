using System;
using TCCTOBK.OperationBackend.Application.Configuration.Queries;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Query.CheckDuplicateActivityProcedure;

public class CheckDuplicateActivityProcedureQuery : IQuery<CheckDuplicateActivityProcedureResult>
{
	public string Code { get; set; } = default!;
}
