using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Domain;

namespace TCCTOBK.OperationBackend.Application.Features.Mobile.Authentication.Query.GetAllAccount;

public class GetAllAccountHandler : IQueryHandler<GetAllAccountQuery, GetAllAccountResult>
{
	private readonly IUnitOfWork _uow;

	public GetAllAccountHandler(IUnitOfWork uow)
	{
		_uow = uow;
	}

	public async Task<GetAllAccountResult> Handle(GetAllAccountQuery request, CancellationToken cancellationToken)
	{
		var tenantIds = new List<Guid> { Constant.TENANT_OPERATION_APP_ID };
		var members = await _uow.MemberRepository.GetAll(request.Filter, request.RoleIds, request.Status, tenantIds, request.IsAvailable, request);
		var memberCount = await _uow.MemberRepository.GetAllCount(request.Filter, request.RoleIds, request.Status, tenantIds, request.IsAvailable, request);

		var res = new List<GetAllAccount>();
		foreach (var member in members)
		{
			var rs = new GetAllAccount()
			{
				Email = member.Email,
				KCUsername = member.KeyCloakUserId ?? "",
				Name = member.Name,
				LastLoginDateTime = member.LastLoginDateTime,
				Role = member.trRoleMembers.First().trRole.Name
			};
			res.Add(rs);
		}

		var paginate = new Paginate()
		{
			Count = res.Count,
			Page = request.Page != 0 ? request.Page : 1,
			Limit = request.Rows,
			Total = memberCount,
		};

		return new GetAllAccountResult(paginate, res);
	}
}
