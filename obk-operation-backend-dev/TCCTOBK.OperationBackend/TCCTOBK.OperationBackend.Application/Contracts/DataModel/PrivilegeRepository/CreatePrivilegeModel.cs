namespace TCCTOBK.OperationBackend.Application.Contracts.DataModel.PrivilegeRepository;

public class CreatePrivilegeModel
{
	public string Name { get; set; } = default!;
	public string Description { get; set; } = default!;
	public bool IsActive { get; set; }
	public List<PrivilgeItem> PrivilgeItem { get; set; } = default!;
}

public class PrivilgeItem
{
	public string name { get; set; } = default!;
	public string Description { get; set; } = default!;
	public string Code { get; set; } = default!;
	public bool IsActive { get; set; }
}