using Microsoft.Extensions.Logging;
using TCCT.ServiceAbstraction.Application.Contracts.FinedayIviva;

namespace TCCT.ServiceAbstraction.Infrastructure.FinedayIviva;
public class FinedayIvivaService(IHttpClientFactory httpClientFactory, IFinedayIvivaEndpointProvider endpointprovider, ILoggerFactory loggerFactory) : IFinedayIvivaService
{
	private readonly IHttpClientFactory _httpclientfactory = httpClientFactory;
	private readonly IFinedayIvivaEndpointProvider _endpointprovider = endpointprovider;
	private readonly ILoggerFactory _loggerFactory = loggerFactory;
	//public IFinedayIvivaLoginService WithLogin()
	//{
	//	return new FinedayIvivaLoginService(_endpointprovider);
	//}
	public IFinedayIvivaMemberService WithMember()
	{
		return new FinedayIvivaMemberService(_endpointprovider, _loggerFactory.CreateLogger<FinedayIvivaMemberService>());
	}
	public IFinedayIvivaTenantService WithTenant()
	{
		return new FinedayIvivaTenantService(_endpointprovider, _loggerFactory.CreateLogger<FinedayIvivaTenantService>());
	}
	public IFinedayIvivaTransactionService WithTransaction()
	{
		return new FinedayIvivaTransactionService(_endpointprovider, _loggerFactory.CreateLogger<FinedayIvivaTransactionService>());
	}
}
