using TCCTOBK.OperationBackend.Application.Configuration.Queries;

namespace TCCTOBK.OperationBackend.Application.Features.Mobile.MasterData.Query.FMRelatedProblemType;
public class FMRelatedProblemTypeQuery : IQuery<FMRelatedProblemTypeResult>
{
	public string Id { get; set; }
	public FMRelatedProblemTypeQuery(string id)
	{
		Id = id;
	}
}
