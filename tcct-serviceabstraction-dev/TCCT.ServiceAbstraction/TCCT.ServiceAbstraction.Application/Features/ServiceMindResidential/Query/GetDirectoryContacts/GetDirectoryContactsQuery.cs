using TCCT.ServiceAbstraction.Application.Configuration.Queries;

namespace TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Query.GetDirectoryContacts;
public class GetDirectoryContactsQuery : IQuery<GetDirectoryContactsResult>
{
	public string? TenantId { get; set; }
	public int? Page { get; set; }
	public int? Limit { get; set; }
	public string? Name { get; set; }
	public string? Lang { get; set; }
	public GetDirectoryContactsQuery(string? tenantId, int? page, int? limit, string? name, string? lang)
	{
		TenantId = tenantId;
		Page = page;
		Limit = limit;
		Name = name;
		Lang = lang;
	}
}
