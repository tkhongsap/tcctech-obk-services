using System;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using TCCTOBK.OperationBackend.Domain.Common;

namespace TCCTOBK.OperationBackend.Domain.Entities;

public class taFCMDevice : Auditable
{
	[Key]
	public Guid Id { get; set; }
	public string DeviceId { get; set; } = default!;
	public string FcmToken { get; set; } = default!;
	public string Platform { get; set; } = default!;
	public string AppVersion { get; set; } = default!;
	public Guid MemberId { get; set; }
	public int UserType { get; set; } // 1 tamember // 2 socuser
	public bool IsActive { get; set; }
	public string AppLanguest { get; set; } = "en";


	public Guid? CSID { get; set; } = Constant.OBK_CLIENT_SITE;
}
