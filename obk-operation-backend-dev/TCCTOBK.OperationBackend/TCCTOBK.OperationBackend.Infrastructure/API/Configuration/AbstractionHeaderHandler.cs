using Microsoft.Extensions.Caching.Memory;
using Refit;
using System.Net.Http.Headers;
using TCCTOBK.OperationBackend.Application.Contracts.API;
using TCCTOBK.OperationBackend.Application.Contracts.DataModel.AuthRepository;
using TCCTOBK.OperationBackend.Domain;

namespace TCCTOBK.OperationBackend.Infrastructure.API.Configuration;
public class AbstractionHeaderHandler : HttpClientHandler
{

	private IAuthService _authService;
	IMemoryCache _cache;
	Semaphore _semaphore;
	string _prefixCache;
	string _domain = DomainConfig.Oauth.OauthURL;

	public AbstractionHeaderHandler(IMemoryCache cache, string prefixCache)
	{
		HttpClientHandler clientHandler = new HttpClientHandler();
		clientHandler.ServerCertificateCustomValidationCallback = (sender, cert, chain, sslPolicyErrors) => true;
		ServerCertificateCustomValidationCallback = (sender, cert, chain, sslPolicyErrors) => true;
		if (prefixCache == Constant.PARQ_CLIENT_SITE_NAME){
			_domain = DomainConfig.Oauth.OauthParqURL;
		}
		_authService = RestService.For<IAuthService>(new HttpClient(clientHandler) { BaseAddress = new Uri(_domain) });
		_cache = cache;
		_semaphore = new Semaphore(2, 2);
		_prefixCache = prefixCache;
	}

	protected override async Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
	{	
		try
		{
			_semaphore.WaitOne();
			var body = new AuthRequestModel
			{
				client_id = DomainConfig.Oauth.ClientId,
				client_secret = DomainConfig.Oauth.ClientSecret,
				grant_type = DomainConfig.Oauth.GrantType,
			};
			if (_prefixCache == Constant.PARQ_CLIENT_SITE_NAME) {
				body = new AuthRequestModel
				{
					client_id = DomainConfig.Oauth.ClientIdParq,
					client_secret = DomainConfig.Oauth.ClientSecretParq,
					grant_type = DomainConfig.Oauth.GrantTypeParq,
				};
			}
			
			var keyCache = _prefixCache + "abstokencache";
			if (!_cache.TryGetValue(keyCache, out AuthResponseModel? item)) // ไม่มีใน cache
			{
				item = await _authService.GetToken(body);
				_cache.Set(keyCache, item, new MemoryCacheEntryOptions().SetAbsoluteExpiration(TimeSpan.FromSeconds(item.expires_in - 10)));
			}
			request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", item!.access_token);
			return await base.SendAsync(request, cancellationToken).ConfigureAwait(false);
		}
		finally
		{
			_semaphore.Release();
		}
	}
}
