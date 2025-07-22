using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Helper.Table;

namespace TCCTOBK.OperationBackend.Application.Features.Sustainability.ContentManagement.Query.GetContentManagement;

public class GetContentManagementQuery : IQuery<GetContentManagementResult>
{
	public Guid CMSID { get; set; }
	public GetContentManagementQuery(Guid cmsid)
	{
		CMSID = cmsid;
	}
}

public class MainContentManagementQuery : IQuery<MainContentManagementResult>
{
	
}
