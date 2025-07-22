using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Application.Features.CMS.MemberManagement.Query.GetMember;

namespace TCCTOBK.OperationBackend.Application.Features.CMS.MemberManagement.Query.GetMembersByRole;
internal class GetMemebersByRoleHandler : IQueryHandler<GetMemebersByRoleQuery, List<GetMemberResult>>
{
	private readonly IUnitOfWork _uow;

	public GetMemebersByRoleHandler(IUnitOfWork uow)
	{
		_uow = uow;
	}

	public async Task<List<GetMemberResult>> Handle(GetMemebersByRoleQuery request, CancellationToken cancellationToken)
	{
		var result = await _uow.MemberRepository.GetMemebersByRole(request.RoleId);

		return result.Select(x => new GetMemberResult
		{
			MID = x.MID,
			Email = x.Email,
			Status = x.Status,
			Name = x.Name,
		}).ToList();
	}
}
