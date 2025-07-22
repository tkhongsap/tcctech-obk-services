using MediatR;
using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Domain.Entities;

namespace TCCTOBK.OperationBackend.Application.Features.Urgent.Query.ServiceRequest;

public class ServiceRequestHandler : IQueryHandler<ServiceRequestQuery, ServiceRequestResult>
{
	IUnitOfWork _uow;
	public ServiceRequestHandler(IUnitOfWork uow)
	{
		_uow = uow;

	}

	public async Task<ServiceRequestResult> Handle(ServiceRequestQuery request, CancellationToken cancellationToken)
	{
		var data = await _uow.ServiceRequestRepository.Paginate(request.Status, request);
		var dataCount = await _uow.ServiceRequestRepository.GetCount(request.Status);
		foreach (var item in data)
		{
			item.CreatedDate = item.CreatedDate.ToUniversalTime();

		}
		var res = new ServiceRequestResult()
		{
			Data = data,
			Total = dataCount
		};
		return res;
	}
}
