using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Application.Contracts.API;
using TCCTOBK.OperationBackend.Domain.Entities;

namespace TCCTOBK.OperationBackend.Application.Features.Urgent.Query.Event;
public class SREventHandler : IQueryHandler<SREventQuery, List<mtSREvent>>
{
	IUnitOfWork _uow;
	public SREventHandler(IUnitOfWork uow)
	{
		_uow = uow;

	}
    
    public async Task<List<mtSREvent>> Handle(SREventQuery request, CancellationToken cancellationToken)
    {
        var res = await _uow.SREventRepository.Paginate(request);
        return res;
    }
}
