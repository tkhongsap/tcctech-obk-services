using System.Reflection.Metadata;
using MediatR;
using TCCTOBK.OperationBackend.Application.Configuration.Commands;
using TCCTOBK.OperationBackend.Application.Features.Marcom.Explore.Model;
using TCCTOBK.OperationBackend.Application.Features.Marcom.Happening.Model;
using TCCTOBK.OperationBackend.Application.Helper.Auditable;

namespace TCCTOBK.OperationBackend.Application.Features.Marcom.Happening.Command.Happening;

public class UpdateHappeningCommand : AuditableModel, ICommand<UpdateHappeningResult>
{
	public Guid? Id { get; set; }
	public Guid? Parent { get; set; }
	public bool Status { get; set; }
	public bool IsShowRelate { get; set; }
	public bool IsArtC { get; set; }
	public bool IsDelete { get; set; }
	public bool IsCategory { get; set; }
	public bool IsHasSub { get; set; }
	public bool IsPin { get; set; }
	public int Order { get; set; }
	public double? Start { get; set; }
	public double? End { get; set; }
	public bool Alltime { get; set; }
	public double? StartEvent { get; set; }
	public double? EndEvent { get; set; }
	public string? LinkToURL {get;set;}
	public int Type { get; set; }
	public int SystemType { get; set; }
	public int ArtType { get; set; }

	public List<string>? Tag { get; set; } = new List<string>();

	public HappeningLang Detail { get; set; } = new HappeningLang();
}
