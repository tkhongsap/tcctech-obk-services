using Refit;
using System.Text.Json.Nodes;

namespace TCCTOBK.OperationBackend.Application;

public interface IFirebaseRemoteConfig
{
	[Get("/remoteConfig")]
	Task<string> GetRemoteConfig([Header("Authorization")] string authtoken);
	[Put("/remoteConfig")]
	Task<string> UpdateRemoteConfig([Header("Authorization")] string authtoken, [Header("If-Match")] string version, [Body] JsonNode data);

}