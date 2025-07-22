using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Contracts;

namespace TCCTOBK.OperationBackend.Application.Features.CMS.RoleManagement.Query.GetPrivileges;

public class GetPrivilegesHandler : IQueryHandler<GetPrivilegesQuery, List<GetPrivilegesResult>>
{
	IUnitOfWork _uow;
	public GetPrivilegesHandler(IUnitOfWork uow)
	{
		_uow = uow;
	}
	public async Task<List<GetPrivilegesResult>> Handle(GetPrivilegesQuery request, CancellationToken cancellationToken)
	{
		var privilege = await _uow.PrivilegeRepository.GetAll(request.Filter, request.Privileges, request.Skip, request.Take);
		var res = privilege.Select(x => new GetPrivilegesResult
		{
			PID = x.PID,
			Name = x.Name,
			PrivilegeItems = x.mtPrivilegeItems.Where(x => x.IsActive).Select(a => new PrivilegeItem
			{
				PID = x.PID,
				PTID = a.PTID,
				Name = a.Name,
				Code = a.Code,
				Description = a.Description,
				IsActive = a.IsActive
			}).ToList()
		}).ToList();
		return res;
	}
}
