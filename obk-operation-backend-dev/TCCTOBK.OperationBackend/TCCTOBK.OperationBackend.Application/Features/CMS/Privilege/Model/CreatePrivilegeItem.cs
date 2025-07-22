namespace TCCTOBK.OperationBackend.Application.Features.CMS.Privilege.Model;
public class CreatePrivilegeItem
{
	public string Name { get; set; } = default!;
	public string Description { get; set; } = default!;
	public string Code { get; set; } = default!;
	public bool IsActive { get; set; }
}
