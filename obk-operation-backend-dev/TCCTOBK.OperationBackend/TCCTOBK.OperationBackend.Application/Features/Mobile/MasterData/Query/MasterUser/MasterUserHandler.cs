using System;
using Org.BouncyCastle.Math.EC.Rfc7748;
using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Application.Contracts.API;
using TCCTOBK.OperationBackend.Application.Contracts.API.Abstraction;

namespace TCCTOBK.OperationBackend.Application.Features.Mobile.MasterData.Query.MasterUser;

public class MasterUserHandler : IQueryHandler<MasterUserQuery, MasterUserResult>
{
  private readonly IUnitOfWork _uow;
  private readonly IAbstractionService _apiService;

  public MasterUserHandler(IUnitOfWork uow, IAbstractionService apiService, IMasterDataService masterDataService)
  {
    _uow = uow;
    _apiService = apiService;
  }

  public async Task<MasterUserResult> Handle(MasterUserQuery request, CancellationToken cancellationToken)
  {
    var data = await _apiService.MasterData.GetMasterUsers();
    var fromuseremail = data.FirstOrDefault(x => x.Id == request.FromUser);
    var touseremail = data.FirstOrDefault(x => x.Id == request.ToUser);
    var res = new MasterUserResult();
    if (fromuseremail != null)
    {
      var fromuser = await _uow.MemberRepository.GetByEmail(fromuseremail.Email, true, true);
      res.FromUser = fromuser.MID;
      res.FromUserName = fromuseremail.FullName ?? fromuser.Email;
    }
    if (touseremail != null)
    {
      var touser = await _uow.MemberRepository.GetByEmail(touseremail.Email, true, true);
      res.ToUser = touser.MID;
      res.ToUserName = touseremail.FullName ?? touseremail.Email;
    }
    return res;
  }
}
