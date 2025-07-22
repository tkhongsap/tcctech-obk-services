using System.Net;
using MediatR;
using TCCTOBK.OperationBackend.Application.Helper.Auditable;
using TCCTOBK.OperationBackend.Domain;

namespace TCCTOBK.OperationBackend.Application;

public class ResetPasswordCMSCommand : AuditableModel, IRequest<ResetPasswordCMSResult>
{
    public string Username { get; set; } = default!;
    public string? Password { get; set; } = Constant.NEW_RESET_PASSWORD;

    public ResetPasswordCMSCommand(string username, string password)
    {
        Username = username;
        Password = password;
    }
}
