using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TCCTOBK.OperationBackend.Domain;
public class OauthConfig
{
	public string OauthURL { get; set; } = default!;
	public string ClientId { get; set; } = default!;
	public string ClientSecret { get; set; } = default!;
	public string GrantType { get; set; } = default!;
	public string OauthParqURL { get; set; } = default!;
	public string ClientIdParq { get; set; } = default!;
	public string ClientSecretParq { get; set; } = default!;
	public string GrantTypeParq { get; set; } = default!;

	public void GetEnvironmentVariables()
	{
		OauthURL = Environment.GetEnvironmentVariable("OAUTH_URL")!;
		ClientId = Environment.GetEnvironmentVariable("OAUTH_CLIENT_ID")!;
		ClientSecret = Environment.GetEnvironmentVariable("OAUTH_CLIENT_SECRET")!;
		GrantType = Environment.GetEnvironmentVariable("OAUTH_GRANT_TYPE")!;
		OauthParqURL = Environment.GetEnvironmentVariable("OAUTH_URL_PARQ")!;
		ClientIdParq = Environment.GetEnvironmentVariable("OAUTH_CLIENT_ID_PARQ")!;
		ClientSecretParq = Environment.GetEnvironmentVariable("OAUTH_CLIENT_SECRET_PARQ")!;
		GrantTypeParq = Environment.GetEnvironmentVariable("OAUTH_GRANT_TYPE_PARQ")!;
	}

	public void SetEnvironmentVariables()
	{
		Environment.SetEnvironmentVariable("OAUTH_URL", OauthURL);
		Environment.SetEnvironmentVariable("OAUTH_CLIENT_ID", ClientId);
		Environment.SetEnvironmentVariable("OAUTH_CLIENT_SECRET", ClientSecret);
		Environment.SetEnvironmentVariable("OAUTH_GRANT_TYPE", GrantType);
		Environment.SetEnvironmentVariable("OAUTH_URL_PARQ", OauthParqURL);
		Environment.SetEnvironmentVariable("OAUTH_CLIENT_ID_PARQ", ClientIdParq);
		Environment.SetEnvironmentVariable("OAUTH_CLIENT_SECRET_PARQ", ClientSecretParq);
		Environment.SetEnvironmentVariable("OAUTH_GRANT_TYPE_PARQ", GrantTypeParq);
	}
}
