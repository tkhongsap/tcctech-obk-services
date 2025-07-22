using System.Reflection.Metadata;
using MediatR;
using TCCTOBK.OperationBackend.Application.Configuration.Commands;
using TCCTOBK.OperationBackend.Application.Features.Sustainability.PRBannerManagement.Command.PRBannerManagement;
using TCCTOBK.OperationBackend.Application.Features.Sustainability.SpecialEvent.Model;
using TCCTOBK.OperationBackend.Application.Helper.Auditable;

namespace TCCTOBK.OperationBackend.Application.Features.Marcom.SpecialEvent.Command.SpecialEvent;

public class UpdateEventCommand : AuditableModel, ICommand<UpdateEventResult>
{
	public Guid? Id { get; set; }
	public string EventName { get; set; } = string.Empty;
	public bool Status { get; set; }
	public bool IsDontShowAgain { get; set; }
	public bool IsDelete { get; set; }
	public int Order { get; set; }
	public double Start { get; set; }
	public double? End { get; set; }
	public bool Alltime { get; set; }
	public SpecialEventLang Detail { get; set; } = new SpecialEventLang();
}
