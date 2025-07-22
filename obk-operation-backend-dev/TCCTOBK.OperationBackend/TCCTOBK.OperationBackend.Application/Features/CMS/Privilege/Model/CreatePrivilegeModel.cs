namespace TCCTOBK.OperationBackend.Application.Features.CMS.Privilege.Model;
public class CreatePrivilegeModel
{
	public string Name { get; set; } = default!;
	public string Description { get; set; } = default!;
	public bool IsActive { get; set; } = default!;
	public List<CreatePrivilegeItem> PrivilegeItem { get; set; } = default!;
}
