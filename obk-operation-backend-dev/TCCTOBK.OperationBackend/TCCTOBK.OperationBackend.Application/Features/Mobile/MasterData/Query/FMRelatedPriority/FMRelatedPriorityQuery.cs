using TCCTOBK.OperationBackend.Application.Configuration.Queries;

namespace TCCTOBK.OperationBackend.Application.Features.Mobile.MasterData.Query.FMRelatedPriority;
public class FMRelatedPriorityQuery : IQuery<FMRelatedPriorityResult>
{
	public string Id { get; set; }
	public FMRelatedPriorityQuery(string id)
	{
		Id = id;
	}
}
