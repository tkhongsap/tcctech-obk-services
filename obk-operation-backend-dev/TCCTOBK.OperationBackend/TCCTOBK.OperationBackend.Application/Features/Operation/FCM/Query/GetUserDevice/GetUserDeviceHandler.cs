using System;
using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Contracts;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.FCM.Query.GetUserDevice;

public class GetUserDeviceHandler : IQueryHandler<GetUserDeviceQuery, List<GetUserDeviceResult>>
{
  private readonly IUnitOfWork _uow;

  public GetUserDeviceHandler(IUnitOfWork uow)
  {
    _uow = uow;
  }
  public async Task<List<GetUserDeviceResult>> Handle(GetUserDeviceQuery request, CancellationToken cancellationToken)

  {
    var data = await _uow.FCMRepository.GetByMemberId(request.id);
    var res = data.Select(x => new GetUserDeviceResult()
    {
      Id = x.Id,
      DeviceId = x.DeviceId,
      FcmToken = x.FcmToken,
      Platform = x.Platform,
      AppVersion = x.AppVersion,
      MemberId = x.MemberId,
      IsActive = x.IsActive,
      appLanguest = x.AppLanguest,
    }).ToList();
    return res;
  }
}
