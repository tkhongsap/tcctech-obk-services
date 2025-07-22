using TCCTOBK.OperationBackend.Application.Configuration.Queries;

namespace TCCTOBK.OperationBackend.Application.Features.Mobile.MasterData.Query.FMRelatedFMTechnician;
public class FMRelatedFMTechnicianQuery : IQuery<FMRelatedFMTechnicianResult>
{
	public string Id { get; set; }
	public FMRelatedFMTechnicianQuery(string id)
	{
		Id = id;
	}
}
