using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Domain.Entities;

namespace TCCTOBK.OperationBackend.Application.Features.Urgent.Query.Problem;
public class ProblemHandler : IQueryHandler<ProblemQuery, List<mtSRProblem>>
{
	IUnitOfWork _uow;
	public ProblemHandler(IUnitOfWork uow)
	{
		_uow = uow;

	}
    public async Task<List<mtSRProblem>> Handle(ProblemQuery request, CancellationToken cancellationToken)
    {
        var res = await _uow.SRProblemRepository.Paginate(request);
        return res;
	}
}
