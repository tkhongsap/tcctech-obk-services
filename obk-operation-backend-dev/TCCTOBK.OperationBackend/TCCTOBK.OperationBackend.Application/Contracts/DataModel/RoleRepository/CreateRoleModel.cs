namespace TCCTOBK.OperationBackend.Application.Contracts.DataModel.RoleRepository;
public class CreateRoleModel
{
	public string Name { get; set; }
	public string? Description { get; set; }
	public bool IsActive { get; set; } = true;

	public CreateRoleModel(string name, string? description, bool isActive)
	{
		Name = name;
		Description = description;
		IsActive = isActive;
	}
}
