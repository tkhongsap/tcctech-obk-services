//using MediatR;
//using TCCTOBK.OperationBackend.Application.Features.CMS.Privilege.Model;

//namespace TCCTOBK.OperationBackend.Application.Features.CMS.Privilege.Command.CreatePrivilege;

//public class CreatePrivilegeCommand : IRequest<CreatePrivilegesResult>
//{
//	public string Name { get; set; } = default!;
//	public string Description { get; set; } = default!;
//	public bool IsActive { get; set; } = default!;
//	public List<CreatePrivilegeItem> PrivilegeItem { get; set; } = default!;

//	public CreatePrivilegeCommand(string name, string description, bool isactive, List<CreatePrivilegeItem> items)
//	{
//		Name = name;
//		Description = description;
//		IsActive = isactive;
//		PrivilegeItem = items;
//	}
//}
