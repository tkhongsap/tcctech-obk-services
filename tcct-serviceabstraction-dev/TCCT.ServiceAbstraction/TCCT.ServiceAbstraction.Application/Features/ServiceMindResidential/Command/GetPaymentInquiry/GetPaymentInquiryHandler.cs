using TCCT.ServiceAbstraction.Application.Configuration.Commands;
using TCCT.ServiceAbstraction.Application.Contracts.Netatmo;
using TCCT.ServiceAbstraction.Application.Contracts.ServiceMindResidential;
using TCCT.ServiceAbstraction.Application.Exceptions;

namespace TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Command.GetPaymentInquiry;
public class GetPaymentInquiryHandler : ICommandHandler<GetPaymentInquiryCommand, GetPaymentInquiryResult>
{
	private readonly IServiceMindResidential _service;
	public GetPaymentInquiryHandler(IServiceMindResidential service)
	{
		_service = service;
	}
	public async Task<GetPaymentInquiryResult> Handle(GetPaymentInquiryCommand request, CancellationToken cancellationToken)
	{
		return await _service.GetPaymentInquiry(request);
	}
}