using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Features.Marcom.SpecialEvent.Query.GetSpecialEvent;
using TCCTOBK.OperationBackend.Application.Features.Sustainability.ContentManagement.Query.GetContentManagement;
using TCCTOBK.OperationBackend.Application.Helper.Table;

namespace TCCTOBK.OperationBackend.Application.Features.Marcom.SpecialEvent.Query.GetSpecialEvent;

public class GetEventQuery : IQuery<GetEventResult>
{
	public Guid EventID { get; set; }
	public GetEventQuery(Guid cmsid)
	{
		EventID = cmsid;
	}
}
