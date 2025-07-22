using System.Net;
using MediatR;
using TCCTOBK.OperationBackend.Application.Helper.Auditable;
using TCCTOBK.OperationBackend.Domain;

namespace TCCTOBK.OperationBackend.Application;

public class ChangePasswordMBCommand : AuditableModel, IRequest<ChangePasswordMBResult>
{
    public string Username { get; set; } = default!;
    public string OldPassword { get; set; } = default!;
    public string NewPassword { get; set; } = default!;

    public ChangePasswordMBCommand(string username, string oldPassword, string newPassword)
    {
        Username = username;
        OldPassword = oldPassword;
        NewPassword = newPassword;
    }
}
