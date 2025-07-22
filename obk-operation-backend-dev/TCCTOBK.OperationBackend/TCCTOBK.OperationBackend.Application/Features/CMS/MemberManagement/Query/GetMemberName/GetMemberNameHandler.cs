using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Contracts;

namespace TCCTOBK.OperationBackend.Application.Features.CMS.MemberManagement.Query.GetMemberName;
internal class GetMemberNameHandler : IQueryHandler<GetMemberNameQuery, string?>
{
	private readonly IUnitOfWork _uow;
	public GetMemberNameHandler(IUnitOfWork uow)
	{
		_uow = uow;
	}
	public Task<string?> Handle(GetMemberNameQuery request, CancellationToken cancellationToken)
	{
		return _uow.MemberRepository.GetMemberNameByKeyCloakUserId(request.KeyCloakUserId);
	}
}
