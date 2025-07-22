using MediatR;
using Microsoft.AspNetCore.Http;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Application.Exceptions;
using TCCTOBK.OperationBackend.Domain;

namespace TCCTOBK.OperationBackend.Application.Features.Sustainability.ChangeOrder.Command.ChangeOrder;

public class ChangeOrderHandler : IRequestHandler<ChangeOrderCommand, ChangeOrderResult>
{
	IUnitOfWork _uow;
	public ChangeOrderHandler(IUnitOfWork uow)
	{
		_uow = uow;
	}
	public async Task<ChangeOrderResult> Handle(ChangeOrderCommand request, CancellationToken cancellationToken)
	{

		ChangeOrderSustainability updateChangeOrder = new ChangeOrderSustainability(request.Id, request.Type, request.NewOrder);

		await _uow.SustainabilityRepository.ChangeOrder(updateChangeOrder, request);
		await _uow.SaveChangeAsyncWithCommit();

		return new ChangeOrderResult() { StatusCode = StatusCodes.Status200OK, Message = "Success" };
	}
}
