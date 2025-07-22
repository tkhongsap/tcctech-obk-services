using MediatR;
using TCCTOBK.OperationBackend.Application.Configuration.Commands;
using TCCTOBK.OperationBackend.Application.Helper.Auditable;

namespace TCCTOBK.OperationBackend.Application.Features.Sustainability.DigitalLibraryManagement.Command.DeleteLibrary;

public class DeleteLibraryCommand : AuditableModel, ICommand<DeleteLibraryResult>
{
	public Guid? Id { get; set; }
}
