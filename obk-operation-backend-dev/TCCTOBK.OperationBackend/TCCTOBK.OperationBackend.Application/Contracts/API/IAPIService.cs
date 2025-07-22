using TCCTOBK.OperationBackend.Application.Contracts.API.Abstraction;

namespace TCCTOBK.OperationBackend.Application.Contracts.API;
public interface IAPIService
{
	public IHomeContentService HomeContent { get; }
	public IFirebaseRemoteConfig FirebaseRemoteConfig { get; }
}
