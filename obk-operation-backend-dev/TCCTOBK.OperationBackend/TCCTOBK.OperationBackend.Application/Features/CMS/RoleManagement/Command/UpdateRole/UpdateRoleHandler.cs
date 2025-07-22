using MediatR;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Application.Contracts.DataModel.RoleRepository;

namespace TCCTOBK.OperationBackend.Application.Features.CMS.RoleManagement.Command.UpdateRole;

internal class UpdateRoleHandler : IRequestHandler<UpdateRoleCommand, UpdateRoleResult>
{
	IUnitOfWork _uow;
	public UpdateRoleHandler(IUnitOfWork uow)
	{
		_uow = uow;
	}
	public async Task<UpdateRoleResult> Handle(UpdateRoleCommand request, CancellationToken cancellationToken)
	{
		var showMenuList = new HashSet<Guid>();
		foreach (var item in request.PrivilegeItems)
		{
			var pitem = await _uow.PrivilegeRepository.GetPrivilegeItemById(item.PTID);
			if (pitem == null || string.IsNullOrWhiteSpace(pitem.Code))
				continue;

			var baseCode = pitem.Code.Split('0').FirstOrDefault();
			if (string.IsNullOrEmpty(baseCode))
				continue;

			var menuCode = baseCode + "000";
			var showMenu = await _uow.PrivilegeRepository.GetByCode(menuCode);
			if (showMenu != null)
				showMenuList.Add(showMenu.PTID);
		}
		var allPrivileges = request.PrivilegeItems.Select(x => x.PTID).ToHashSet();
		allPrivileges.UnionWith(showMenuList); // รวม PTID ของ menu ที่ต้องแสดง

		var updatedRole = new UpdateRoleModel
		{
			RID = request.Rid,
			Name = request.RoleName,
			Description = request.Description,
			IsActive = request.Status == 1,
			Privilages = allPrivileges.ToList(),
		};
		await _uow.RoleRepository.ClearPrivilege(request.Rid);
		await _uow.SaveChangeAsyncWithCommit();

		await _uow.RoleRepository.UpdateRole(updatedRole, request);
		await _uow.SaveChangeAsyncWithCommit();

		return new UpdateRoleResult();
	}
}
