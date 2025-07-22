namespace TCCTOBK.OperationBackend.Application.Helper.Service;
public interface IAuditableService
{
	public string KeyCloakUserId { get; }
	public Guid MID { get; }
	public string MemberName { get; }
	public DateTime TimeStamp { get; }
	public Guid SystemID { get; }
	public string SystemName { get; }
}
