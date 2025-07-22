using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Helper.Table;

namespace TCCTOBK.OperationBackend.Application.Features.Mobile.Authentication.Query.GetAllAccount;
public class GetAllAccountQuery : TableState, IQuery<GetAllAccountResult>
{
	public string? Filter { get; set; }
	public List<Guid> RoleIds { get; set; } = new();
	public int? Status { get; set; }
	public bool IsAvailable  { get; set; } = false;
}

