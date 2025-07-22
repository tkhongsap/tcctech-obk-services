using MediatR;
using TCCTOBK.OperationBackend.Application.Features.CMS.Privilege.Model;

namespace TCCTOBK.OperationBackend.Application.Features.CMS.Privilege.Command.CreatePrivileges;

public record CreatePrivilegesCommand(List<CreatePrivilegeModel> Privileges) : IRequest<int>;