using TCCTOBK.OperationBackend.Domain;

namespace TCCTOBK.OperationBackend.Application.Contracts.DataModel.AttendanceRepository;
public class UpdateAttendanceModel
{
	public required string UserId { get; set; }
	public required string IdentifyDate { get; set; }
	public DateTime CheckOutDateTime { get; set; }
	public string? MetaData { get; set; } = default!;

	public Guid? CSID { get; set; } = Constant.OBK_CLIENT_SITE;

}
