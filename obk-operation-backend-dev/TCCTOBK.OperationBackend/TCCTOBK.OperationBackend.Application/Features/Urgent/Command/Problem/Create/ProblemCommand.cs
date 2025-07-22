using MediatR;
using TCCTOBK.OperationBackend.Application.Helper.Auditable;
using TCCTOBK.OperationBackend.Domain.Entities;

namespace TCCTOBK.OperationBackend.Application.Features.Urgent.Command.Problem.Create;

public class ProblemCommand : AuditableModel, IRequest<mtSRProblem>
{
    public string Name_th { get; set; }
    public string Name_en { get; set; }


}
