using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Features.Sustainability.ContentManagement.Query.GetAllContentManagement;
using TCCTOBK.OperationBackend.Application.Helper.Table;

namespace TCCTOBK.OperationBackend.Application.Features.Marcom.Happening.Query.GetAllContent;

public class GetAllContentQuery : TableState, IQuery<GetAllContentResult>
{
	public string? Filter { get; set; }
	public int? Status { get; set; }
	public Guid? ParentId { get; set; }
	public bool? IsPin { get; set; }
}
