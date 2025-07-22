using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Features.Sustainability.PRBannerManagement.Query.GetAllPRBannerManagement;
using TCCTOBK.OperationBackend.Application.Helper.Table;

namespace TCCTOBK.OperationBackend.Application.Features.Sustainability.PRBannerManagement.Query.GetAllDigitalLibrary;

public class GetAllPRBannerManagementQuery : TableState, IQuery<GetAllPRBannerManagementResult>
{
	public string? Filter { get; set; }
	public int? Status { get; set; }
	public Guid? ParentId { get; set; }
}
