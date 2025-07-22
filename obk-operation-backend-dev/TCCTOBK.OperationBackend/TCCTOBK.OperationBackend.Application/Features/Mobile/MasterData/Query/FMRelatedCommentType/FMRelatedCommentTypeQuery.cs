using TCCTOBK.OperationBackend.Application.Configuration.Queries;

namespace TCCTOBK.OperationBackend.Application.Features.Mobile.MasterData.Query.FMRelatedCommentType;
public class FMRelatedCommentTypeQuery : IQuery<FMRelatedCommentTypeResult>
{
	public string Id { get; set; }
	public FMRelatedCommentTypeQuery(string id)
	{
		Id = id;
	}
}
