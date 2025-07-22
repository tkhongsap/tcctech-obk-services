using MediatR;
using TCCTOBK.OperationBackend.Application.Helper.Auditable;

namespace TCCTOBK.OperationBackend.Application;

public class ResetPasswordCommand : AuditableModel, IRequest<ResetPasswordResult>
{
	public string ResetPasswordCode { get; set; } = default!;
}
