using MediatR;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Domain;



namespace TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Query.GetSocMember;

public class GetSocMemberHandler : IRequestHandler<GetSocMemberQuery, GetSocMemberResult>
{
  IUnitOfWork _uow;

  public GetSocMemberHandler(IUnitOfWork uow)
  {
    _uow = uow;
  }

  public async Task<GetSocMemberResult> Handle(GetSocMemberQuery request, CancellationToken cancellationToken)
  {
    var role = await _uow.RoleRepository.GetRoleByRefId([Constant.CERTIS_SOC_ROLE_ID]);
    var user = await _uow.MemberRepository.GetMemebersByRole(role[0].RID);
    var res = user.Select(x => new SocUser()
    {
      Id = x.MID,
      Name = !string.IsNullOrEmpty(x.Name) ? x.Name : (!string.IsNullOrEmpty(x.FirstName) ? string.Concat(x.FirstName, " ", x.LastName) : x.Email)
    }).ToList();
    return new GetSocMemberResult() { Data = res };
  }
}
