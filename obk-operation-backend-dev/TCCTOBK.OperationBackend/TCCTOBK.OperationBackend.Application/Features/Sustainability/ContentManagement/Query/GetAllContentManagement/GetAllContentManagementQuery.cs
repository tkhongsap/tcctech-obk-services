using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Features.Sustainability.ContentManagement.Query.GetAllContentManagement;
using TCCTOBK.OperationBackend.Application.Helper.Table;

namespace TCCTOBK.OperationBackend.Application.Features.Sustainability.ContentManagement.Query.GetAllDigitalLibrary;

public class GetAllContentManagementQuery : TableState, IQuery<GetAllContentManagementResult>
{
	public string? Filter { get; set; }
	public int? Status { get; set; }
	public Guid? ParentId { get; set; }
}
