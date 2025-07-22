using System.Linq;
using MediatR;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Application.Contracts.DataModel.RoleRepository;
using TCCTOBK.OperationBackend.Application.Exceptions;
using TCCTOBK.OperationBackend.Application.Features.CMS.RoleManagement.Query.GetPrivileges;
using TCCTOBK.OperationBackend.Domain;

namespace TCCTOBK.OperationBackend.Application.Features.CMS.RoleManagement.Command.CreateRole;

internal class CreateRoleHandler : IRequestHandler<CreateRoleCommand, CreateRoleResult>
{
	IUnitOfWork _uow;
	public CreateRoleHandler(IUnitOfWork uow)
	{
		_uow = uow;
	}
	public async Task<CreateRoleResult> Handle(CreateRoleCommand request, CancellationToken cancellationToken)
	{
		var checkrolename = await _uow.RoleRepository.GetByName(request.RoleName);
		if (checkrolename.Count > 0) throw new BadRequestException("Role name ชื่อซ้ำกันในระบบ");
		bool status = request.Status == 1;
		var createrole = new CreateRoleModel(request.RoleName, request.Description, status);
		var newrole = await _uow.RoleRepository.CreateRole(createrole, request);
		await _uow.SaveChangeAsyncWithCommit();
		var showmenulist = new List<Guid>();
		foreach (var item in request.PrivilegeItems)
		{
			var pitem = await _uow.PrivilegeRepository.GetPrivilegeItemById(item.PTID);
			var menucode = pitem.Code.Split('0').First();
			menucode = menucode + "000";
			var showmenu = await _uow.PrivilegeRepository.GetByCode(menucode);
			if (showmenu != null && !showmenulist.Contains(showmenu.PTID))
			{
				showmenulist.Add(showmenu.PTID);
			}
		}
		var privilegeItems = request.PrivilegeItems.Select(x => x.PTID).ToList();
		privilegeItems.AddRange(showmenulist);
		await _uow.PrivilegeRepository.UpdatePrivilegeItem(newrole, privilegeItems);
		await _uow.SaveChangeAsyncWithCommit();
		return new CreateRoleResult() { Message = "success" };
	}
}