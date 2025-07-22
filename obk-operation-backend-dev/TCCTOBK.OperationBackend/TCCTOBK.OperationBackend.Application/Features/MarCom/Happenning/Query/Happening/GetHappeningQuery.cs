using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Features.Sustainability.ContentManagement.Query.GetContentManagement;

namespace TCCTOBK.OperationBackend.Application.Features.Marcom.Happening.Query.GetHappening;

public class GetHappeningQuery : IQuery<GetHappeningResult>
{
	public Guid HappeningID { get; set; }
	public GetHappeningQuery(Guid cmsid)
	{
		HappeningID = cmsid;
	}
}

public class CategoryListQuery : IQuery<CategoryListResult>
{
	public Guid? HappeningID { get; set; }
}