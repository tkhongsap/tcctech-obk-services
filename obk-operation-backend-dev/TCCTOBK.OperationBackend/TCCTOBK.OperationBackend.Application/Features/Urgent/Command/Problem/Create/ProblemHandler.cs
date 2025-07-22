using System.Text.RegularExpressions;
using MediatR;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Application.Contracts.DataModel.StaffRepository;
using TCCTOBK.OperationBackend.Domain.Entities;

namespace TCCTOBK.OperationBackend.Application.Features.Urgent.Command.Problem.Create;

public class ProblemHandler : IRequestHandler<ProblemCommand, mtSRProblem>
{
    private readonly IUnitOfWork _uow;

    public ProblemHandler(IUnitOfWork uow)
    {
        _uow = uow;
    }

    private async Task AddProblem(mtSRProblem problemEntity)
    {
        await _uow.SRProblemRepository.Add(problemEntity);
    }

    public async Task<mtSRProblem> Handle(ProblemCommand request, CancellationToken cancellationToken)
    {
        var problemEntity = new mtSRProblem
        {
            Name_th = request.Name_th,
            Name_en = request.Name_en,
            CreatedBy = request.CreatedBy,
            CreatedDate = request.CreatedDate,
            CreatedByName = request.CreatedByName,
            UpdatedBy = request.UpdatedBy,
            UpdatedDate = request.UpdatedDate,
            UpdatedByName = request.UpdatedByName
        };

        await AddProblem(problemEntity);
        return problemEntity;
    }
}
