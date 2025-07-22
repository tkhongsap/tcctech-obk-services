using System.Reflection.Metadata;
using MediatR;
using TCCTOBK.OperationBackend.Application.Configuration.Commands;
using TCCTOBK.OperationBackend.Application.Helper.Auditable;

namespace TCCTOBK.OperationBackend.Application.Features.Marcom.Explore.Command.DeleteExplore;

public class DeleteExploreCommand : AuditableModel, ICommand<DeleteExploreResult>
{
	public Guid? Id { get; set; }
}
