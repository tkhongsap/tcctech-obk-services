using MediatR;
using TCCTOBK.OperationBackend.Application.Helper.Auditable;

namespace TCCTOBK.OperationBackend.Application;

public class ForgotPasswordCommand : AuditableModel, IRequest<ForgotPasswordResult>
{
	public string Email { get; set; } = default!;
	public ForgotPasswordCommand(string email)
	{
		Email = email;
	}
}
