using System;
using MediatR;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Application.Exceptions;

namespace TCCTOBK.OperationBackend.Application.Features.Mobile.User.Query.UserClientStie;

public class UserClientStieHandler : IRequestHandler<UserClientStieQuery, UserClientStieResult>
{
  private readonly IUnitOfWork _uow;

  public UserClientStieHandler(IUnitOfWork uow)
  {
    _uow = uow;
  }

  public async Task<UserClientStieResult> Handle(UserClientStieQuery request, CancellationToken cancellationToken)
  {
    var res = new UserClientStieResult();
    var member = await _uow.MemberRepository.GetByKeyCloakUserId(request.KCUsername);

    foreach (var item in member.ClientMember)
    {
      var userclientsite = new UserClientData();
      var cs = await _uow.ClientSiteRepository.GetClientSiteById(item.CSID);
      userclientsite.CSID = cs.CSID;
      userclientsite.ClientSiteName = cs.Name;
      res.UserClientData.Add(userclientsite);
    }
    return res;
  }

  private string GetRoleValue(int role)
  {
    if (role == 1) return "Supervisor";
    if (role == 2) return "SOC";
    if (role == 3) return "Outsource Supervisor";
    if (role == 4) return "DCC Manager";
    if (role == 5) return "FMC Manager";
    if (role == 6) return "SOC Manager";
    return "";
  }
}
