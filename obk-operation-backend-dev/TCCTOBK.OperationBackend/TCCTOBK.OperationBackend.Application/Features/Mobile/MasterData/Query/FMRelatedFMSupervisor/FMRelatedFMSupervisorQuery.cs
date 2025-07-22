using TCCTOBK.OperationBackend.Application.Configuration.Queries;

namespace TCCTOBK.OperationBackend.Application.Features.Mobile.MasterData.Query.FMRelatedFMSupervisor;
public class FMRelatedFMSupervisorQuery : IQuery<FMRelatedFMSupervisorResult>
{
	public string Id { get; set; }
	public FMRelatedFMSupervisorQuery(string id)
	{
		Id = id;
	}
}
