using System.Reflection.Metadata;
using MediatR;
using TCCTOBK.OperationBackend.Application.Configuration.Commands;
using TCCTOBK.OperationBackend.Application.Features.Marcom.Explore.Model;
using TCCTOBK.OperationBackend.Application.Helper.Auditable;

namespace TCCTOBK.OperationBackend.Application.Features.Marcom.Explore.Command.Explore;

public class UpdateExploreCommand : AuditableModel, ICommand<UpdateExploreResult>
{
	public Guid? Id { get; set; }
	public bool Status { get; set; }
	public bool IsShowRelate { get; set; }
	public bool IsDelete { get; set; }
	public int Order { get; set; }
	public List<string>? Tag { get; set; } = new List<string>();
	public ExploreLang Detail { get; set; } = new ExploreLang();
}
