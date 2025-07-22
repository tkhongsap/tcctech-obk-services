using TCCTOBK.OperationBackend.Application.Configuration.Queries;

namespace TCCTOBK.OperationBackend.Application.Features.Mobile.MasterData.Query.FMRelatedFMTechnicianService;
public class FMRelatedFMTechnicianServiceQuery : IQuery<FMRelatedFMTechnicianServiceResult>
{
	public string Id { get; set; }
	public FMRelatedFMTechnicianServiceQuery(string id)
	{
		Id = id;
	}
}
