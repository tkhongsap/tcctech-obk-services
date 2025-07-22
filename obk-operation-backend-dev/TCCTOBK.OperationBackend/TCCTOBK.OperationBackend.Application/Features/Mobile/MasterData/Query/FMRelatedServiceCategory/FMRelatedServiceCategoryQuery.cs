using TCCTOBK.OperationBackend.Application.Configuration.Queries;

namespace TCCTOBK.OperationBackend.Application.Features.Mobile.MasterData.Query.FMRelatedServiceCategory;
public class FMRelatedServiceCategoryQuery : IQuery<FMRelatedServiceCategoryResult>
{
	public string Id { get; set; }
	public FMRelatedServiceCategoryQuery(string id)
	{
		Id = id;
	}
}
