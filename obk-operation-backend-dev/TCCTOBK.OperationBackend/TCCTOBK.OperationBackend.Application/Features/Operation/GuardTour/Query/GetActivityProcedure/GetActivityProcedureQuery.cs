using TCCTOBK.OperationBackend.Application.Configuration.Queries;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Query.GetActivityProcedure;
public class GetActivityProcedureQuery : IQuery<GetActivityProcedureResult>
{
	public Guid APID { get; set; }

}
