using TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Model;

namespace TCCTOBK.OperationBackend.Application.Contracts.DataModel.SubtaskActionRepository;
public class UpdateSubtaskActionModel
{
	public Guid STID { get; set; } = Guid.Empty;
	public Guid AID { get; set; } = Guid.Empty;
	public int StatusId { get; set; }
	public string? Remarks { get; set; }
	public string? Reading { get; set; }
	public GuardTourSubtaskActionMetaDataResult? MetaData { get; set; }
	public string? QrId { get; set; }

	public UpdateSubtaskActionModel(Guid aid, Guid stid, int statusId, string? remarks, string? reading, GuardTourSubtaskActionMetaDataResult? metaData, string? qrId)
	{
		STID = stid;
		AID = aid;
		StatusId = statusId;
		Remarks = remarks;
		Reading = reading;
		MetaData = metaData;
		QrId = qrId;
	}
}
