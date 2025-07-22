using TCCTOBK.OperationBackend.Application.Configuration.Queries;

namespace TCCTOBK.OperationBackend.Application.Features.Mobile.MasterData.Query.FMRelatedRequesterType;
public class FMRelatedRequesterTypeQuery : IQuery<FMRelatedRequesterTypeResult>
{
	public string Id { get; set; }
	public FMRelatedRequesterTypeQuery(string id)
	{
		Id = id;
	}
}
