using System;

namespace TCCTOBK.OperationBackend.Application.Contracts.DataModel.FCMRepository;

public class CreateFCMDeviceModel
{
	public string DeviceId { get; set; } = default!;
	public string FcmToken { get; set; } = default!;
	public string Platform { get; set; } = default!;
	public string AppVersion { get; set; } = default!;
	public Guid MemberId { get; set; }
	public bool IsActive { get; set; }
	public string AppLanguage { get; set; } = "en";
}
