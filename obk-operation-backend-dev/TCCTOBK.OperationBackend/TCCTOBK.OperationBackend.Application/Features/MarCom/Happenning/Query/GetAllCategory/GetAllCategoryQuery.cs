using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Helper.Table;

namespace TCCTOBK.OperationBackend.Application.Features.Marcom.Happening.Query.GetAllCategory;

public class GetAllCategoryQuery : TableState, IQuery<GetAllCategoryResult>
{
	public string? Filter { get; set; }
	public int? Status { get; set; }
}
