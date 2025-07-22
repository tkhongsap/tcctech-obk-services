using TCCTOBK.OperationBackend.Application.Configuration.Queries;

namespace TCCTOBK.OperationBackend.Application.Features.Mobile.MasterData.Query.FMRelatedRequester;
public class FMRelatedRequesterQuery : IQuery<FMRelatedRequesterResult>
{
	public string Id { get; set; }
	public FMRelatedRequesterQuery(string id)
	{
		Id = id;
	}
}
