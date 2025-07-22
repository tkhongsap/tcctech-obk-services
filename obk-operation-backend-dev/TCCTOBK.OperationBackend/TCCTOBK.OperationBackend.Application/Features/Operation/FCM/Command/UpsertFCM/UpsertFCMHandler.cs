using System;
using TCCTOBK.OperationBackend.Application.Configuration.Commands;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Application.Contracts.DataModel.FCMRepository;
using TCCTOBK.OperationBackend.Application.Exceptions;
using TCCTOBK.OperationBackend.Application.Helper.Auditable;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.FCM.Command.UpsertFCM;

public class UpsertFCMHandler : ICommandHandler<UpsertFCMCommand, UpsertFCMResult>
{
	private readonly IUnitOfWork _uow;

	public UpsertFCMHandler(IUnitOfWork uow)
	{
		_uow = uow;
	}

	public async Task<UpsertFCMResult> Handle(UpsertFCMCommand request, CancellationToken cancellationToken)
	{
		var fcmModel = new CreateFCMDeviceModel();
		var auditable = new AuditableModel();
		try
		{
			var member = await _uow.MemberRepository.GetByKeyCloakUserId(request.KCUserId);
			fcmModel.DeviceId = request.DeviceId;
			fcmModel.FcmToken = request.FcmToken;
			fcmModel.Platform = request.Platform;
			fcmModel.AppVersion = request.AppVersion;
			fcmModel.MemberId = member.MID;
			fcmModel.IsActive = true;
			fcmModel.AppLanguage = request.AppLanguage;
			auditable.CreatedBy = member.MID;
			auditable.CreatedByName = member.Email;
			auditable.CreatedDate = DateTime.Now;
			auditable.UpdatedBy = member.MID;
			auditable.UpdatedByName = member.Email;
			auditable.UpdatedDate = DateTime.Now;
		}
		catch
		{
			throw new BadRequestException("Cannot Upsert FCM Token");
		}
		_ = await _uow.FCMRepository.DeleteByFCMToken(request.FcmToken);
		_ = await _uow.FCMRepository.Insert(fcmModel, auditable);
		await _uow.SaveChangeAsyncWithCommit();
		return new UpsertFCMResult();
	}
}
