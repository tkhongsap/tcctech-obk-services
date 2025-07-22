using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Domain;
using TCCTOBK.OperationBackend.Domain.Entities;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Query.GetShiftManPower;
public class GetShiftManPowerQuery : IQuery<mtShiftManPowerRequest>
{
	public int Id { get; set; }
	public GetShiftManPowerQuery(int id)
	{
		Id = id;
	}
}