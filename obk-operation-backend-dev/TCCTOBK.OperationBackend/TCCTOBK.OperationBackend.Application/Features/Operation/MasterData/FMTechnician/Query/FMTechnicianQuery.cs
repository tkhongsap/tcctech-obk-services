using TCCTOBK.OperationBackend.Application.Configuration.Queries;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.MasterData.FMTechnician.Query;
public class FMTechnicianQuery : IQuery<FMTechnicianResult>
{
	public string FMTechnicianId { get; set; }

	public FMTechnicianQuery(string id)
	{
		FMTechnicianId = id;
	}
	public FMTechnicianQuery()
	{
	}
}