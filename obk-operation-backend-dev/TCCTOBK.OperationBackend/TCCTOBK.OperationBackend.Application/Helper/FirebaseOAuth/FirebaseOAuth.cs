using Google.Apis.Auth.OAuth2;
using TCCTOBK.OperationBackend.Domain;

namespace TCCTOBK.OperationBackend.Application;

public class FirebaseOAuth
{
	FirebaseAdminConfig _config;
	public FirebaseOAuth(FirebaseAdminConfig config)
	{
		_config = config;
	}

	public async Task<string> AuthRemoteConfig()
	{
		var servicekey = new JsonCredentialParameters()
		{
			Type = _config.Type,
			ProjectId = _config.ProjectId,
			PrivateKeyId = _config.PrivateKeyId,
			PrivateKey = _config.PrivateKey,
			ClientEmail = _config.ClientEmail,
			ClientId = _config.ClientId,
			TokenUri = _config.TokenUri,
			UniverseDomain = _config.UniverseDomain,
		};

		var credentials = GoogleCredential.FromJsonParameters(servicekey);
		var scopedCredentials = credentials.CreateScoped(new[] { "https://www.googleapis.com/auth/firebase.remoteconfig" });
		return await scopedCredentials.UnderlyingCredential.GetAccessTokenForRequestAsync();
	}
}
