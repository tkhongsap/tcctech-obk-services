using System.Reflection.Metadata;
using MediatR;
using TCCTOBK.OperationBackend.Application.Configuration.Commands;
using TCCTOBK.OperationBackend.Application.Features.Sustainability.ContentManagement.Command.ContentManagement;
using TCCTOBK.OperationBackend.Application.Features.Sustainability.ContentManagement.Command.DeleteContentManagement;
using TCCTOBK.OperationBackend.Application.Helper.Auditable;

namespace TCCTOBK.OperationBackend.Application.Features.Sustainability.DigitalLibraryManagement.Command.DeleteContentManagement;

public class DeleteContentManagementCommand : AuditableModel, ICommand<DeleteContentManagementResult>
{
	public Guid? Id { get; set; }

}

