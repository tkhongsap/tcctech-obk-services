using System;
using TCCTOBK.OperationBackend.Application.Configuration.Commands;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.FCM.Command.UpsertFCM;

public class UpsertFCMCommand : ICommand<UpsertFCMResult>
{
	public string DeviceId { get; set; } = default!;
	public string FcmToken { get; set; } = default!;
	public string Platform { get; set; } = default!;
	public string AppVersion { get; set; } = default!;
	public string KCUserId { get; set; } = default!;
	public string AppLanguage { get; set; } = "en";
}
