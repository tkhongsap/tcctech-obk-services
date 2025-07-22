using MediatR;
using Org.BouncyCastle.Asn1.Cms;
using TCCTOBK.OperationBackend.Application.Helper.Table;
using TCCTOBK.OperationBackend.Application.Helper.Auditable;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.PPM.Command.UpsertPPM;

public class UpsertPPMCommand : TableState, IRequest<UpsertPPMResult>
{
	public double LastMinute { get; set; } = 6;
	public DateTime? StartDate { get; set; }
	public DateTime? EndDate { get; set; }
	public string? MessageTemplate { get; set; } = null;
	public int? PPMId { get; set; } = null;
	public Guid? SendFrom { get; set; }
	public Guid? SendTo { get; set; }
	public bool IsFirstSync { get; set; } = false;
}
