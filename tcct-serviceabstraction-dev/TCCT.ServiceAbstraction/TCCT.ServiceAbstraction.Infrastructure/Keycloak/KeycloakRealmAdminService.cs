using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;
using TCCT.ServiceAbstraction.Application.Contracts.Keycloak;
using TCCT.ServiceAbstraction.Application.Exceptions;
using TCCT.ServiceAbstraction.Application.Features.Keycloak;
using TCCT.ServiceAbstraction.Application.Features.Keycloak.AddAuthAlias;
using TCCT.ServiceAbstraction.Application.Features.Keycloak.CreateUser;
using TCCT.ServiceAbstraction.Application.Features.Keycloak.EventsLog;
using TCCT.ServiceAbstraction.Application.Features.Keycloak.GetUser;
using TCCT.ServiceAbstraction.Application.Features.Keycloak.RemoveAuthAlias;
using TCCT.ServiceAbstraction.Application.Features.Keycloak.ResetPassword;
using TCCT.ServiceAbstraction.Application.Features.Keycloak.UpdatePassword;

namespace TCCT.ServiceAbstraction.Infrastructure.Keycloak;
internal class KeycloakRealmAdminService(string authattrname, string clientid, string clientsecret, IMemoryCache cache, IHttpClientFactory httpClientFactory, IKeycloakEndpointProvider endpointprovider, ILoggerFactory loggerFactory) : IKeycloakRealmAdminService
{
	private string _authattrname = authattrname;
	private string _clientid = clientid;
	private string _clientsecret = clientsecret;
	private IMemoryCache _cache = cache;
	private IHttpClientFactory _httpClientFactory = httpClientFactory;
	private IKeycloakEndpointProvider _endpointprovider = endpointprovider;
	private readonly ILogger<KeycloakRealmAdminService> _logger = loggerFactory.CreateLogger<KeycloakRealmAdminService>();
	
	/// <summary>
	/// Get access token from keycloak, by grant_type client_credentials
	/// </summary>
	/// <returns></returns>
	private async Task<KeycloakResponse> GetClientCredential()
	{
		var endpoint = _endpointprovider.GetOpenIDTokenUrl();

		var keyval = new List<KeyValuePair<string, string>>
		{
			new KeyValuePair<string, string>("client_id", _clientid),
			new KeyValuePair<string, string>("client_secret", _clientsecret),
			new KeyValuePair<string, string>("grant_type", "client_credentials")
		};

		var client = _httpClientFactory.CreateClient("ignoressl");
		var req = new HttpRequestMessage(HttpMethod.Post, endpoint) { Content = new FormUrlEncodedContent(keyval) };
		var httpres = await client.SendAsync(req);

		string responseBody = await httpres.Content.ReadAsStringAsync();
		LoggerService.LogRequestAndResponse(_logger, httpres, responseBody);
		if (!httpres.IsSuccessStatusCode) throw KeycloakServiceException.KCS003(responseBody);

		return JsonSerializer.Deserialize<KeycloakResponse>(responseBody)!;
	}

	/// <summary>
	/// Get access token from keycloak, by grant_type client_credentials, from cache
	/// </summary>
	/// <returns></returns>
	private async Task<string> GetClientCredentialFromCache(string clientsecret)
	{
		if (!_cache.TryGetValue("kctoken" + clientsecret, out KeycloakResponse? cc)) // ไม่มีใน cache
		{
			cc = await GetClientCredential();
			_cache.Set("kctoken" + clientsecret, cc, new MemoryCacheEntryOptions().SetAbsoluteExpiration(TimeSpan.FromSeconds(cc.expires_in - 10)));
		}
		return cc!.access_token;
	}

	/// <summary>
	/// Create a user in keycloak, by admin client such as admin-cli
	/// </summary>
	/// <param name="emailOrPhone">email or phone</param>
	/// <param name="password">password</param>
	/// <param name="firstname">first name</param>
	/// <param name="lastname">last name</param>
	/// <returns></returns>
	public async Task<CreateUserResult> CreateUser(string emailOrPhone, string password, string firstName, string lastName, bool forceAddEmail)
	{
		var endpoint = _endpointprovider.GetUsersUrl();

		var username = Guid.NewGuid().ToString();

		var client = _httpClientFactory.CreateClient("ignoressl");
		client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", await GetClientCredentialFromCache(_clientsecret));

		HttpResponseMessage httpres;
		if (forceAddEmail)
		{
			httpres = await client.PostAsJsonAsync(endpoint, new
			{
				username,
				email = emailOrPhone,
				firstName,
				lastName,
				enabled = true,
				credentials = new[] { new { type = "password", value = password, temporary = false } },
				attributes = new Dictionary<string, string> { { _authattrname, emailOrPhone } },
				emailVerified = true
			});
		}
		else
		{
			httpres = await client.PostAsJsonAsync(endpoint, new
			{
				username,
				firstName,
				lastName,
				enabled = true,
				credentials = new[] { new { type = "password", value = password, temporary = false } },
				attributes = new Dictionary<string, string> { { _authattrname, emailOrPhone } },
				emailVerified = true
			});
		}

		string body = await httpres.Content.ReadAsStringAsync(); // create user will return nothing when success
		LoggerService.LogRequestAndResponse(_logger, httpres, body);
		if (!httpres.IsSuccessStatusCode)
		{
			//if (body.Contains("User exists with same username or email")) throw KeycloakServiceException.KCS013; // next feature
			throw KeycloakServiceException.KCS003(body);
		}

		var user = await GetUserByUsernameOrAttribute(emailOrPhone);
		return new CreateUserResult()
		{
			Username = user.Username
		};
	}

	/// <summary>
	/// Get user by username or authentication attribute
	/// </summary>
	/// <param name="usernameorattribute">Username or Authentication attribute such as Email, Phone</param>
	/// <returns></returns>
	public async Task<GetUserInternalResult> GetUserByUsernameOrAttribute(string usernameorattribute, bool throwKCS001ifnotfound = false)
	{
		//-- ถ้าเป็น Guid ถือว่าเป็น username เสมอ
		var querystr = Guid.TryParse(usernameorattribute, out _) ? $"username={usernameorattribute}" : $"q={_authattrname}:{Uri.EscapeDataString(usernameorattribute)}";
		var endpoint = _endpointprovider.GetUsersUrl(querystr);

		var client = _httpClientFactory.CreateClient("ignoressl");
		client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", await GetClientCredentialFromCache(_clientsecret));
		var httpres = await client.GetAsync(endpoint);

		string body = await httpres.Content.ReadAsStringAsync();
		LoggerService.LogRequestAndResponse(_logger, httpres, body);
		if (!httpres.IsSuccessStatusCode) throw KeycloakServiceException.KCS003(body);

		var users = JsonSerializer.Deserialize<List<GetUserResponse>>(body)!;
		if (users.Count == 0) // user not found
		{
			if (throwKCS001ifnotfound) throw KeycloakServiceException.KCS001;
			throw KeycloakServiceException.KCS002;
		}

		var user = users[0];
		return new GetUserInternalResult()
		{
			ID = user.id,
			Username = user.username,
			AuthAttributes = user.attributes[_authattrname].ToList(), // ต้องมีอย่างน้อย 1 ค่าเสมอ
			Firstname = user.firstName,
			Lastname = user.lastName,
			Email = user.email
		};
	}

	public async Task<ResetPasswordResult> ResetPassword(string usernameOrAttribute, string newPassword)
	{
		var user = await GetUserByUsernameOrAttribute(usernameOrAttribute);
		var endpoint = _endpointprovider.GetResetPasswordUrl(user.ID);

		var client = _httpClientFactory.CreateClient("ignoressl");
		client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", await GetClientCredentialFromCache(_clientsecret));
		var httpres = await client.PutAsJsonAsync(endpoint, new
		{
			type = "password",
			value = newPassword,
			temporary = false
		});
		if (!httpres.IsSuccessStatusCode) throw KeycloakServiceException.KCS004;
		return new ResetPasswordResult();
	}

	public async Task<UpdatePasswordResult> UpdatePassword(string usernameOrAttribute, string oldPassword, string newPassword)
	{
		_ = await KeycloakRealmService.Login(_clientid, _clientsecret, usernameOrAttribute, oldPassword, _httpClientFactory, _endpointprovider);
		_ = await ResetPassword(usernameOrAttribute, newPassword);
		return new UpdatePasswordResult();
	}



	public async Task<AddAuthAliasResult> AddAuthAlias(string usernameOrAttribute, string newAttribute)
	{
		//-- มีคนใช้ attribute นี้แล้วหรือไม่
		try
		{
			_ = await GetUserByUsernameOrAttribute(newAttribute);
			throw KeycloakServiceException.KCS010; // Cannot add attribute that exist in the realm
		}
		catch (KeycloakServiceException ee)
		{
			if (ee.Code != KeycloakServiceException.KCS002.Code) throw; // ถ้าไม่ใช่ user not found แสดงว่ามีคนใช้ attribute นี้แล้ว
		}

		//-- ตรวจสอบว่า attribute เกิน 6 ตัวแล้วหรือไม่, ถ้ายังไม่เกินก็ add เพิ่มได้
		var user = await GetUserByUsernameOrAttribute(usernameOrAttribute);
		if (user.AuthAttributes.Count >= 6) throw KeycloakServiceException.KCS005; // excption: cannot add attribute, attributes have already full
		user.AuthAttributes.Add(newAttribute);

		//-- เอา attribute ใหม่ไป set
		var issuccess = await PutAttribute(user.ID, user.AuthAttributes);
		if (!issuccess) throw KeycloakServiceException.KCS006;

		return new AddAuthAliasResult()
		{
			AuthAttributes = user.AuthAttributes
		};
	}

	public async Task<RemoveAuthAliasResult> RemoveAuthAlias(string usernameOrAttribute, string removeAttribute, bool cannotRemoveEmail)
	{
		var user = await GetUserByUsernameOrAttribute(usernameOrAttribute);
		if (!user.AuthAttributes.Contains(removeAttribute)) throw KeycloakServiceException.KCS008; // Cannot remove attribute that not exist
		if (cannotRemoveEmail && !string.IsNullOrEmpty(user.Email) && string.Equals(user.Email, removeAttribute, StringComparison.OrdinalIgnoreCase)) throw KeycloakServiceException.KCS011;
		if (user.AuthAttributes.Count == 1) throw KeycloakServiceException.KCS009; // Cannot remove last attribute
		user.AuthAttributes.Remove(removeAttribute);

		//-- เอา attribute ใหม่ไป set
		var issuccess = await PutAttribute(user.ID, user.AuthAttributes);
		if (!issuccess) throw KeycloakServiceException.KCS007;

		return new RemoveAuthAliasResult()
		{
			AuthAttributes = user.AuthAttributes
		};
	}

	private async Task<bool> PutAttribute(Guid userid, List<string> authattributes)
	{
		var endpoint = _endpointprovider.GetUserUrl(userid);

		var req = new { attributes = new Dictionary<string, List<string>>() { { _authattrname, authattributes } } };

		var client = _httpClientFactory.CreateClient("ignoressl");
		client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", await GetClientCredentialFromCache(_clientsecret));
		var httpRes = await client.PutAsJsonAsync(endpoint, req);
		return httpRes.IsSuccessStatusCode;
	}

	public async Task<List<EventsLogRespones>> GetEventLog(int max, string type, DateOnly? dateFrom, DateOnly? dateTo, int? first, Guid? user)
	{
		//-- ถ้าเป็น Guid ถือว่าเป็น username เสมอ
		var querystr = $"max={max}&type={type}&client=admin-cli";
		if (dateFrom.HasValue) querystr += $"&dateFrom={dateFrom.Value:yyyy-MM-dd}";
		if (dateTo.HasValue) querystr += $"&dateTo={dateTo.Value:yyyy-MM-dd}";
		if (first.HasValue) querystr += $"&first={first}";
		if (user.HasValue) querystr += $"&user={user}";
		var endpoint = _endpointprovider.GetEventsLog(querystr);

		var client = _httpClientFactory.CreateClient("ignoressl");
		client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", await GetClientCredentialFromCache(_clientsecret));
		var httpres = await client.GetAsync(endpoint);

		string body = await httpres.Content.ReadAsStringAsync();
		if (!httpres.IsSuccessStatusCode) throw KeycloakServiceException.KCS003(body);

		var res = JsonSerializer.Deserialize<List<EventsLogRespones>>(body)!;


		return res;
	}

}
