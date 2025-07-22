using System;
using Microsoft.EntityFrameworkCore;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Application.Contracts.DataModel.FCMRepository;
using TCCTOBK.OperationBackend.Application.Helper.Auditable;
using TCCTOBK.OperationBackend.Application.Helper.Service;
using TCCTOBK.OperationBackend.Application.Repositories;
using TCCTOBK.OperationBackend.Domain.Entities;

namespace TCCTOBK.OperationBackend.Infrastructure.Repositories;

public class FCMRepository : BaseRepository, IFCMRepository
{
	private readonly IClientSiteService _clientSiteService;

	public FCMRepository(ITCCTOBKContext context, IClientSiteService clientSiteService) : base(context)
	{
		_clientSiteService = clientSiteService;
	}

	public Task<List<taFCMDevice>> GetByMemberId(Guid memberId)
	{
		return Context.FCMDevice.Where(x => x.MemberId == memberId && x.IsActive).ToListAsync();
	}

	public Task<List<taFCMDevice>> GetByFCMToken(string fcmToken)
	{
		return Context.FCMDevice.Where(x => x.FcmToken == fcmToken && x.IsActive).ToListAsync();
	}

	public async Task<taFCMDevice> Insert(CreateFCMDeviceModel data, AuditableModel auditable)
	{
		var entity = new taFCMDevice
		{
			DeviceId = data.DeviceId,
			FcmToken = data.FcmToken,
			Platform = data.Platform,
			AppVersion = data.AppVersion,
			MemberId = data.MemberId,
			IsActive = data.IsActive,
			CreatedBy = auditable.CreatedBy,
			CreatedByName = auditable.CreatedByName!,
			CreatedDate = auditable.CreatedDate,
			AppLanguest = data.AppLanguage,
			UpdatedBy = auditable.UpdatedBy,
			UpdatedByName = auditable.UpdatedByName!,
			UpdatedDate = auditable.UpdatedDate,
			CSID = _clientSiteService.ClientSiteId
		};

		await Context.FCMDevice.AddAsync(entity);
		return entity;
	}

	public Task<int> DeleteByFCMToken(string fcmToken)
	{
		return Context.FCMDevice.Where(x => x.FcmToken == fcmToken && x.CSID == _clientSiteService.ClientSiteId).ExecuteDeleteAsync();
	}

	public Task<int> RemoveByDeviceId(string deviceid)
	{
		return Context.FCMDevice.Where(x => x.FcmToken == deviceid && x.CSID == _clientSiteService.ClientSiteId).ExecuteDeleteAsync();
	}

	public async Task UpdateAppLanguest(string deviceid, string code)
	{
		var data = await Context.FCMDevice.AsTracking().FirstOrDefaultAsync(x => x.DeviceId == deviceid && x.CSID == _clientSiteService.ClientSiteId);
		data.AppLanguest = code;
	}

	public Task<int> RemoveToken(string deviceid, string fcmToken)
	{
		return Context.FCMDevice.Where(x => x.DeviceId == deviceid && x.FcmToken == fcmToken && x.CSID == _clientSiteService.ClientSiteId).ExecuteDeleteAsync();
	}

	public async Task UpdateAppLanguest(string deviceid, string fcmtoken, string code, Guid memberId)
	{
		var data = await Context.FCMDevice.AsTracking().FirstOrDefaultAsync(x => x.DeviceId == deviceid && x.FcmToken == fcmtoken && x.MemberId == memberId && x.CSID == _clientSiteService.ClientSiteId);
		data.AppLanguest = code;
	}
}
