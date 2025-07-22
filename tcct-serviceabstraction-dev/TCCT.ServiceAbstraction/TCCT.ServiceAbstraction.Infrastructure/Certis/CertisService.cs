using TCCT.ServiceAbstraction.Application.Contracts.Certis;
using TCCT.ServiceAbstraction.Application.Contracts.Certis.MasterData;
using TCCT.ServiceAbstraction.Application.Contracts.Certis.Transaction;
using TCCT.ServiceAbstraction.Infrastructure.Certis.MasterData;
using TCCT.ServiceAbstraction.Infrastructure.Certis.Transaction;

namespace TCCT.ServiceAbstraction.Infrastructure.Certis;
public partial class CertisService : ICertisService
{
	ICertisEndpointProvider _endpointprovider;
	ICertisMemoryCache _cache;

	public CertisService(ICertisMemoryCache cache, ICertisEndpointProvider endpointProvider)
	{
		_endpointprovider = endpointProvider;
		_cache = cache;
	}

	private ICertisMasterDataService _masterdata = null!;
	public ICertisMasterDataService MasterData => _masterdata ??= new CertisMasterDataService(_cache, _endpointprovider);
	private ICertisTransactionService _transactiondata = null!;
	public ICertisTransactionService Transaction => _transactiondata ??= new CertisTransactionService(_cache, _endpointprovider);
}
