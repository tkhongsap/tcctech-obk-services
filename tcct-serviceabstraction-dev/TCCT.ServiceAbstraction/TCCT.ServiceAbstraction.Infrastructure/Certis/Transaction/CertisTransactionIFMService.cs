using Microsoft.AspNetCore.Http;
using TCCT.ServiceAbstraction.Application.Contracts.Certis;
using TCCT.ServiceAbstraction.Application.Contracts.Certis.Transaction;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.IFM.CWOsbyincidentId;

namespace TCCT.ServiceAbstraction.Infrastructure.Certis.Transaction;
public class CertisTransactionIFMService : ICertisTransactionIFMService
{
	ICertisEndpointProvider _endpointprovider;
	ICertisMemoryCache _cache;

	public CertisTransactionIFMService(ICertisMemoryCache cache, ICertisEndpointProvider endpointProvider)
	{
		_endpointprovider = endpointProvider;
		_cache = cache;
	}

	public Task<List<CWOsbyincidentIdResult>> CWOsbyincidentId(int id)
	{
		return _endpointprovider.CWOsbyincidentId(id);
	}
}
