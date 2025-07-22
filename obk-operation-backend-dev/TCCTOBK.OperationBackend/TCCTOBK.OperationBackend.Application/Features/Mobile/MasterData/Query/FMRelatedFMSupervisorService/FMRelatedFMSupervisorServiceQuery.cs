using TCCTOBK.OperationBackend.Application.Configuration.Queries;

namespace TCCTOBK.OperationBackend.Application.Features.Mobile.MasterData.Query.FMRelatedFMSupervisorService;
public class FMRelatedFMSupervisorServiceQuery : IQuery<FMRelatedFMSupervisorServiceResult>
{
	public string Id { get; set; }
	public FMRelatedFMSupervisorServiceQuery(string id)
	{
		Id = id;
	}
}
