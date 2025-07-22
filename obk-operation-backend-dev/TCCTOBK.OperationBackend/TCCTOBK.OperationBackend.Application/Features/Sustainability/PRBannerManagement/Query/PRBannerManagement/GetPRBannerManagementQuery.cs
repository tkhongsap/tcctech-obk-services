using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Features.Sustainability.ContentManagement.Query.GetContentManagement;
using TCCTOBK.OperationBackend.Application.Helper.Table;

namespace TCCTOBK.OperationBackend.Application.Features.Sustainability.PRBannerManagement.Query.GetPRBannerManagement;

public class GetPRBannerManagementQuery : IQuery<GetPRBannerManagementResult>
{
	public Guid PRBannerID { get; set; }
	public GetPRBannerManagementQuery(Guid cmsid)
	{
		PRBannerID = cmsid;
	}
}

public class InitialPRBannerQuery : IQuery<GetInitialPRBannerResult>
{

}
