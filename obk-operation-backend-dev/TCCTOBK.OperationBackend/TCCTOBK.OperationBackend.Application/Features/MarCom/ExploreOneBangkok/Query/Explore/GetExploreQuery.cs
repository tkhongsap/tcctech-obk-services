using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Features.Sustainability.ContentManagement.Query.GetContentManagement;
using TCCTOBK.OperationBackend.Application.Helper.Table;

namespace TCCTOBK.OperationBackend.Application.Features.Marcom.Explore.Query.GetExplore;

public class GetExploreQuery : IQuery<GetExploreResult>
{
	public Guid ExploreID { get; set; }
	public GetExploreQuery(Guid cmsid)
	{
		ExploreID = cmsid;
	}
}

