using Refit;
using TCCTOBK.OperationBackend.Application;
using TCCTOBK.OperationBackend.Application.Contracts.API;
using TCCTOBK.OperationBackend.Application.Contracts.API.Abstraction;
using TCCTOBK.OperationBackend.Domain;

namespace TCCTOBK.OperationBackend.Infrastructure.API;
internal class APIService : IAPIService
{
	private Lazy<IHomeContentService> _homeContent => new Lazy<IHomeContentService>(() => RestService.For<IHomeContentService>(DomainConfig.CMSAPI.HomeContentPath));
	private Lazy<IFirebaseRemoteConfig> _firebaseRemoteConfig => new Lazy<IFirebaseRemoteConfig>(() => RestService.For<IFirebaseRemoteConfig>(DomainConfig.CMSAPI.FirebaseRemoteConfigPath));
	#region Services
	public IHomeContentService HomeContent => _homeContent.Value;
	public IFirebaseRemoteConfig FirebaseRemoteConfig => _firebaseRemoteConfig.Value;

	#endregion
}
