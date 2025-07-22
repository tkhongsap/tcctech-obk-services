using TCCT.ServiceAbstraction.Application.Contracts.Certis;
using TCCT.ServiceAbstraction.Application.Contracts.Certis.Transaction;

namespace TCCT.ServiceAbstraction.Infrastructure.Certis.Transaction;
public partial class CertisTransactionService : ICertisTransactionService
{
	ICertisEndpointProvider _endpointprovider;
	ICertisMemoryCache _cache;

	public CertisTransactionService(ICertisMemoryCache cache, ICertisEndpointProvider endpointProvider)
	{
		_endpointprovider = endpointProvider;
		_cache = cache;
	}
	private ICertisTransactionCWOService _cwoservice = null!;
	public ICertisTransactionCWOService CWOService => _cwoservice ??= new CertisTransactionCWOService(_cache, _endpointprovider);
	private ICertisTransactionDMSService _dmsservice = null!;
	public ICertisTransactionDMSService DMSService => _dmsservice ??= new CertisTransactionDMSService(_cache, _endpointprovider);
	private ICertisTransactionPPMService _ppmservice = null!;
	public ICertisTransactionPPMService PPMService => _ppmservice ??= new CertisTransactionPPMService(_cache, _endpointprovider);
	private ICertisTransactionCMSService _cmsservice = null!;
	public ICertisTransactionCMSService CMSService => _cmsservice ??= new CertisTransactionCMSService(_cache, _endpointprovider);
	private ICertisTransactionCoreService _coreservice = null!;
	public ICertisTransactionCoreService CoreService => _coreservice ??= new CertisTransactionCoreService(_cache, _endpointprovider);
	private ICertisTransactionWFMService _wfmservice = null!;
	public ICertisTransactionWFMService WFMService => _wfmservice ??= new CertisTransactionWFMService(_cache, _endpointprovider);
	private ICertisTransactionIFMService _ifmservice = null!;
	public ICertisTransactionIFMService IFMService => _ifmservice ??= new CertisTransactionIFMService(_cache, _endpointprovider);
}
