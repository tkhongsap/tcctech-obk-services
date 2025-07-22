using TCCTOBK.OperationBackend.Application.Configuration.Queries;

namespace TCCTOBK.OperationBackend.Application.Features.Mobile.MasterData.Query.FMRelatedChecklistTask;
public class FMRelatedChecklistTaskQuery : IQuery<FMRelatedChecklistTaskResult>
{
	public string Id { get; set; }
	public FMRelatedChecklistTaskQuery(string id)
	{
		Id = id;
	}
}
