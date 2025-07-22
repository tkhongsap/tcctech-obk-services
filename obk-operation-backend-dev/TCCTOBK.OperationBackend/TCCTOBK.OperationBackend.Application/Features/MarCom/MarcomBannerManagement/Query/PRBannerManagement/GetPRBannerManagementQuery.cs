using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Features.Sustainability.ContentManagement.Query.GetContentManagement;
using TCCTOBK.OperationBackend.Application.Helper.Table;

namespace TCCTOBK.OperationBackend.Application.Features.Sustainability.PRBannerManagement.Query.GetPRBannerManagement;

public class GetMarcomBannerManagementQuery : IQuery<GetMarcomBannerManagementResult>
{
	public Guid PRBannerID { get; set; }
	public GetMarcomBannerManagementQuery(Guid cmsid)
	{
		PRBannerID = cmsid;
	}
}

public class InitialMarcomBannerQuery : IQuery<GetInitialMarcomBannerResult>
{

}
