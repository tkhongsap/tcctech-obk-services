//using System.Net;
//using System.Net.Http.Json;
//using System.Text.Json;
//using TCCT.ServiceAbstraction.Application.Contracts.FinedayIviva;
//using TCCT.ServiceAbstraction.Application.Exceptions;
//using TCCT.ServiceAbstraction.Application.Features.FinedayIviva;
//using TCCT.ServiceAbstraction.Application.Features.FinedayIviva.Login.CheckToken;
//using TCCT.ServiceAbstraction.Application.Features.FinedayIviva.Login.ForceLogout;
//using TCCT.ServiceAbstraction.Application.Features.FinedayIviva.Login.Login;
//using TCCT.ServiceAbstraction.Application.Features.FinedayIviva.Login.Logout;
//using TCCT.ServiceAbstraction.Application.Features.FinedayIviva.Login.TestConnection;

//namespace TCCT.ServiceAbstraction.Infrastructure.FinedayIviva;
//public class FinedayIvivaLoginService(IFinedayIvivaEndpointProvider endpointprovider) : IFinedayIvivaLoginService
//{
//	private readonly IFinedayIvivaEndpointProvider _endpointprovider = endpointprovider;

//	public async Task<LoginResult> Login(string username, string password)
//	{
//		var endpoint = _endpointprovider.GetLoginLoginUrl();

//		var httpres = await _endpointprovider.GetClientFromFactory().PostAsJsonAsync(endpoint, new
//		{
//			username,
//			password
//		});
//		var resbody = await httpres.Content.ReadAsStringAsync();
//		if (httpres.StatusCode == HttpStatusCode.BadRequest) throw FinedayIvivaServiceException.FIS002;
//		if (!httpres.IsSuccessStatusCode) throw FinedayIvivaServiceException.FIS001;
//		var res = JsonSerializer.Deserialize<FinedayIvivaResponse<LoginResult>>(resbody)!;
//		return res.data!;
//	}

//	public async Task<LogoutResult> Logout(string token)
//	{
//		var endpoint = _endpointprovider.GetLoginLogoutUrl();

//		var httpres = await _endpointprovider.GetClientFromFactory().PostAsJsonAsync(endpoint, new
//		{
//			token
//		});
//		var resbody = await httpres.Content.ReadAsStringAsync();
//		if (httpres.StatusCode == HttpStatusCode.BadRequest) throw FinedayIvivaServiceException.FIS003;
//		if (!httpres.IsSuccessStatusCode) throw FinedayIvivaServiceException.FIS001;
//		return new LogoutResult(); // empty result
//	}

//	public async Task<CheckTokenResult> CheckToken(string token)
//	{
//		var endpoint = _endpointprovider.GetLoginCheckTokenUrl();

//		var httpres = await _endpointprovider.GetClientFromFactory().PostAsJsonAsync(endpoint, new
//		{
//			token
//		});
//		var resbody = await httpres.Content.ReadAsStringAsync();
//		if (httpres.StatusCode == HttpStatusCode.BadRequest) throw FinedayIvivaServiceException.FIS003;
//		if (!httpres.IsSuccessStatusCode) throw FinedayIvivaServiceException.FIS001;
//		var res = JsonSerializer.Deserialize<FinedayIvivaResponse<CheckTokenResult>>(resbody)!;
//		return res.data!;
//	}

//	public async Task<ForceLogoutResult> ForceLogout(int userID)
//	{
//		var endpoint = _endpointprovider.GetLoginForceLogoutUrl();

//		var httpres = await _endpointprovider.GetClientFromFactory().PostAsJsonAsync(endpoint, new
//		{
//			userID
//		});
//		var resbody = await httpres.Content.ReadAsStringAsync();
//		if (httpres.StatusCode == HttpStatusCode.BadRequest) throw FinedayIvivaServiceException.FIS004;
//		if (!httpres.IsSuccessStatusCode) throw FinedayIvivaServiceException.FIS001;
//		return new ForceLogoutResult(); // empty result
//	}

//	public async Task<TestConnectionResult> TestConnection()
//	{
//		var endpoint = _endpointprovider.GetLoginTestConnectionUrl();

//		var httpres = await _endpointprovider.GetClientFromFactory().GetAsync(endpoint);
//		var resbody = await httpres.Content.ReadAsStringAsync();
//		if (!httpres.IsSuccessStatusCode) throw FinedayIvivaServiceException.FIS001;
//		var res = JsonSerializer.Deserialize<FinedayIvivaResponse<TestConnectionResult>>(resbody)!;
//		return res.data!;
//	}

//}
