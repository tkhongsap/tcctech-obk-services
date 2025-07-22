using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Domain;
using TCCTOBK.OperationBackend.Domain.Entities;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Query.GetShift;
public class GetShiftQuery : IQuery<mtShift>
{
	public int Id { get; set; }
	public GetShiftQuery(int id)
	{
		Id = id;
	}
}