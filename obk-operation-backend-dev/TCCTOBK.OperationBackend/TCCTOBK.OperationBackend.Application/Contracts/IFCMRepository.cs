using System;
using TCCTOBK.OperationBackend.Application.Contracts.DataModel.FCMRepository;
using TCCTOBK.OperationBackend.Application.Helper.Auditable;
using TCCTOBK.OperationBackend.Domain.Entities;

namespace TCCTOBK.OperationBackend.Application.Contracts;

public interface IFCMRepository
{
	Task<List<taFCMDevice>> GetByMemberId(Guid memberId);
	Task<List<taFCMDevice>> GetByFCMToken(string fcmToken);
	Task<taFCMDevice> Insert(CreateFCMDeviceModel data, AuditableModel auditable);
	Task<int> DeleteByFCMToken(string fcmToken);
	Task<int> RemoveByDeviceId(string deviceid);
	Task<int> RemoveToken(string deviceid, string fcmToken);
	Task UpdateAppLanguest(string deviceid, string fcmtoken, string code, Guid memberId);
	Task UpdateAppLanguest(string deviceid, string code);
}
