using System.Reflection.Metadata;
using MediatR;
using TCCTOBK.OperationBackend.Application.Configuration.Commands;
using TCCTOBK.OperationBackend.Application.Features.Sustainability.PRBannerManagement.Command.DeletePRBannerManagement;
using TCCTOBK.OperationBackend.Application.Features.Sustainability.PRBannerManagement.Command.PRBannerManagement;
using TCCTOBK.OperationBackend.Application.Helper.Auditable;

namespace TCCTOBK.OperationBackend.Application.Features.Sustainability.PRBannerManagement.Command.DeletePRBannerManagement;

public class DeletePRBannerManagementCommand : AuditableModel, ICommand<DeletePRBannerManagementResult>
{
	public Guid? Id { get; set; }
}
