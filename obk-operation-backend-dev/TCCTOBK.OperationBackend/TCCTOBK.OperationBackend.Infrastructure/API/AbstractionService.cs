using Microsoft.Extensions.Caching.Memory;
using Refit;
using TCCTOBK.OperationBackend.Application.Contracts.API;
using TCCTOBK.OperationBackend.Application.Contracts.API.Abstraction;
using TCCTOBK.OperationBackend.Application.Helper.Service;
using TCCTOBK.OperationBackend.Domain;
using TCCTOBK.OperationBackend.Infrastructure.API.Configuration;

namespace TCCTOBK.OperationBackend.Infrastructure.API;
public class AbstractionService : IAbstractionService
{
	IMemoryCache _cache;
	private readonly IClientSiteService _clientSiteService;
	string _prefixCache = Constant.OBK_CLIENT_SITE_NAME;
	string _domainUrl = DomainConfig.Abstraction.AbstractionURL;

	public AbstractionService(IMemoryCache cache, IClientSiteService clientSiteService)
	{
		_cache = cache;
		_clientSiteService = clientSiteService;
		if (_clientSiteService.ClientSiteId == Constant.PARQ_CLIENT_SITE) 
		{
			_prefixCache = Constant.PARQ_CLIENT_SITE_NAME;
			_domainUrl = DomainConfig.Abstraction.AbstractionParqURL;
		}
	}
	public IAbstractionOperationService Operation => RestService.For<IAbstractionOperationService>(new HttpClient(new AbstractionHeaderHandler(_cache, _prefixCache)) { BaseAddress = new Uri(_domainUrl) });
	public IAbstractionCertisTransactionService CertisTransaction => RestService.For<IAbstractionCertisTransactionService>(new HttpClient(new AbstractionHeaderHandler(_cache, _prefixCache)) { BaseAddress = new Uri(_domainUrl) });
	public IMasterData MasterData => RestService.For<IMasterData>(new HttpClient(new AbstractionHeaderHandler(_cache, _prefixCache)) { BaseAddress = new Uri(_domainUrl) });
	public IUserService UserService => RestService.For<IUserService>(new HttpClient(new AbstractionHeaderHandler(_cache, _prefixCache)) { BaseAddress = new Uri(_domainUrl) });
	public IAbstractionInnoflexService InnoflexService => RestService.For<IAbstractionInnoflexService>(new HttpClient(new AbstractionHeaderHandler(_cache, _prefixCache)) { BaseAddress = new Uri(_domainUrl) });
}
