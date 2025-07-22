namespace TCCTOBK.OperationBackend.Application.Contracts.DataModel.RoleRepository;

public class UpdateRoleModel
{
	public required Guid RID { get; set; }
	public required string Name { get; set; }
	public string? Description { get; set; }
	public bool IsActive { get; set; } = true;
	public List<Guid> Privilages = default!;
}
