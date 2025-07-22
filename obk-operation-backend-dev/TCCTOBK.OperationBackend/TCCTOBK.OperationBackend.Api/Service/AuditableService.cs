using TCCTOBK.OperationBackend.Application.Helper.Service;

namespace TCCTOBK.OperationBackend.Api.Service;

public class AuditableService : IAuditableService
{
	private readonly IHttpContextAccessor _httpContextAccessor;
	public string KeyCloakUserId => _httpContextAccessor.HttpContext?.Items["KeyCloakUserId"]?.ToString() ?? Guid.Empty.ToString();
	public string MemberName => _httpContextAccessor.HttpContext?.Items["MemberName"]?.ToString() ?? "";
	public Guid MID => Guid.Parse(_httpContextAccessor.HttpContext?.Items["MID"]?.ToString() ?? "");
	public DateTime TimeStamp => DateTime.Now;
	public Guid SystemID => new Guid("00000000-0000-0000-0000-000000000000");

	public string SystemName => "Operation CMS";

	public AuditableService(IHttpContextAccessor httpContextAccessor)
	{
		_httpContextAccessor = httpContextAccessor;
	}
}
