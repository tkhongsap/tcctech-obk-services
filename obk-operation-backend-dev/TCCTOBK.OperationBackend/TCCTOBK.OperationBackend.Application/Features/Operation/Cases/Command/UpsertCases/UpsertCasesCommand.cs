using MediatR;
using Org.BouncyCastle.Asn1.Cms;
using TCCTOBK.OperationBackend.Application.Helper.Table;
using TCCTOBK.OperationBackend.Application.Helper.Auditable;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.Cases.Command.UpsertCases;

public class UpsertCasesCommand : TableState, IRequest<UpsertCasesResult>
{	
	public int? Status { get; set; }
	public double LastMinute { get; set; } = 6;
	public DateTime? StartDate { get; set; }
	public DateTime? EndDate { get; set; }
	public List<int>? CaseIdList { get; set; }
}
