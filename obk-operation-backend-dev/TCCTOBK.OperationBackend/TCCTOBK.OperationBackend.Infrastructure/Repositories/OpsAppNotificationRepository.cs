using System;
using System.Data.Common;
using Microsoft.EntityFrameworkCore;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Application.Exceptions;
using TCCTOBK.OperationBackend.Application.Helper.Service;
using TCCTOBK.OperationBackend.Application.Repositories;
using TCCTOBK.OperationBackend.Domain.Entities;

namespace TCCTOBK.OperationBackend.Infrastructure.Repositories;

public class OpsAppNotificationRepository : BaseRepository<OpsAppNotification>, IOpsAppNotificationRepository
{

  private readonly IClientSiteService _clientSiteService;

  public OpsAppNotificationRepository(ITCCTOBKContext context, IClientSiteService clientSiteService) : base(context)
  {
    _clientSiteService = clientSiteService;
  }
  public async Task Create(OpsAppNotification data)
  {
    var dt = new OpsAppNotification()
    {
      OANID = Guid.NewGuid(),
      FromUser = data.FromUser,
      FromUserName = data.FromUserName,
      ToUser = data.ToUser,
      ToUserName = data.ToUserName,
      UserType = data.UserType,
      MessageType = data.MessageType,
      Title = data.Title,
      Message = data.Message,
      MessageEn = data.MessageEn,
      IsSendSuccess = data.IsSendSuccess,
      FCMResult = data.FCMResult,
      IsRead = data.IsRead,
      IsActive = data.IsActive,
      CreatedDate = DateTime.Now.ToUniversalTime(),
      WorkId = data.WorkId,
      CSID = _clientSiteService.ClientSiteId
    };
    await Db.AddAsync(dt);
  }

  public async Task Delete(Guid id)
  {
    var data = await Db.AsTracking().FirstOrDefaultAsync(x => x.OANID == id && x.CSID == _clientSiteService.ClientSiteId);
    if (data == null) throw new NotFoundException("Notification Not found");
    Db.Remove(data);
  }

  public async Task<List<OpsAppNotification>> GetByUser(Guid userid)
  {
    var data = await Db.AsNoTracking().Where(x => x.ToUser == userid && x.CreatedDate >= DateTime.Now.AddDays(-3)).ToListAsync();
    return data;
  }

  public async Task Read(Guid id)
  {
    var data = await Db.AsTracking().FirstOrDefaultAsync(x => x.OANID == id);
    if (data == null) throw new NotFoundException("Notification Not found");
    data.IsRead = true;
  }

  public async Task Update(OpsAppNotification data)
  {
    var dt = await Db.AsTracking().FirstOrDefaultAsync(x => x.OANID == data.OANID);
    if (data == null) return;
    dt.FromUser = data.FromUser;
    dt.FromUserName = data.FromUserName;
    dt.ToUser = data.ToUser;
    dt.ToUserName = data.ToUserName;
    dt.UserType = data.UserType;
    dt.MessageType = data.MessageType;
    dt.Title = data.Title;
    dt.Message = data.Message;
    dt.MessageEn = data.MessageEn;
    dt.IsSendSuccess = data.IsSendSuccess;
    dt.FCMResult = data.FCMResult;
    dt.IsActive = data.IsActive;
    dt.CSID = _clientSiteService.ClientSiteId;
  }
}
