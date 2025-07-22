using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using TCCT.ServiceAbstraction.Application.Contracts.AlphaX;
using TCCT.ServiceAbstraction.Application.Contracts.CarparkPayment;
using TCCT.ServiceAbstraction.Application.Contracts.Certis;
using TCCT.ServiceAbstraction.Application.Contracts.FinedayIviva;
using TCCT.ServiceAbstraction.Application.Contracts.FinedayResidence;
using TCCT.ServiceAbstraction.Application.Contracts.Keycloak;
using TCCT.ServiceAbstraction.Application.Contracts.LogPose;
using TCCT.ServiceAbstraction.Application.Contracts.Netatmo;
using TCCT.ServiceAbstraction.Application.Contracts.Innoflex;
using TCCT.ServiceAbstraction.Application.Contracts.ServiceMindResidential;
using TCCT.ServiceAbstraction.Domain;
using TCCT.ServiceAbstraction.Infrastructure.AlphaX;
using TCCT.ServiceAbstraction.Infrastructure.CarparkPayment;
using TCCT.ServiceAbstraction.Infrastructure.Certis;
using TCCT.ServiceAbstraction.Infrastructure.FinedayIviva;
using TCCT.ServiceAbstraction.Infrastructure.FinedayResidence;
using TCCT.ServiceAbstraction.Infrastructure.Keycloak;
using TCCT.ServiceAbstraction.Infrastructure.LogPose;
using TCCT.ServiceAbstraction.Infrastructure.Netatmo;
using TCCT.ServiceAbstraction.Infrastructure.Innoflex;
using TCCT.ServiceAbstraction.Infrastructure.ServiceMindResidential;
using TCCT.ServiceAbstraction.Application.Contracts.MT;
using TCCT.ServiceAbstraction.Infrastructure.MT;
using TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Query.GetHome;
using TCCT.ServiceAbstraction.Application.Contracts;
using TCCT.ServiceAbstraction.Infrastructure.Libraries;
using Microsoft.Extensions.Logging;
using TCCT.ServiceAbstraction.Application.Contracts.EV;
using TCCT.ServiceAbstraction.Infrastructure.EV;
using TCCT.ServiceAbstraction.Application.Contracts.Payment;
using TCCT.ServiceAbstraction.Infrastructure.Payment;

namespace TCCT.ServiceAbstraction.Infrastructure;
public static class InfrastructureServiceRegistration
{
	public static IServiceCollection AddInfrastructureService(this IServiceCollection services, IConfiguration configuration)
	{
		services.AddHttpClient("ignoressl")
			.ConfigurePrimaryHttpMessageHandler(() =>
			{
				return new HttpClientHandler
				{
					ServerCertificateCustomValidationCallback = (m, crt, chn, e) => true
				};
			});

		//-- Keycloak
		services.AddScoped<IKeycloakEndpointProvider, KeycloakEndpointProvider>();
		services.AddScoped<IKeycloakService, KeycloakService>();

		//-- AlphaX
		services.AddScoped(x => DomainConfig.AirQuality);
		services.AddScoped<IAlphaXService, AlphaXService>();
		services.AddScoped<IAlphaXEndpointProvider, AlphaXEndpointProvider>();
		services.AddSingleton<IAlphaXMemoryCache, AlphaXMemoryCache>();

		//-- Certis
		services.AddScoped(x => DomainConfig.Certis);
		services.AddScoped<ICertisService, CertisService>();
		services.AddScoped<ICertisEndpointProvider, CertisEndpointProvider>();
		services.AddSingleton<ICertisMemoryCache, CertisMemoryCache>();

		//-- FinedayIviva
		services.AddScoped(x => DomainConfig.FinedayIviva);
		services.AddScoped<IFinedayIvivaService, FinedayIvivaService>();
		services.AddScoped<IFinedayIvivaEndpointProvider, FinedayIvivaEndpointProvider>();
		services.AddSingleton<IFinedayIvivaMemoryCache, FinedayIvivaMemoryCache>();

		//-- FinedayResidence
		services.AddScoped(x => DomainConfig.FinedayResidence);
		services.AddScoped<IFinedayResidenceService, FinedayResidenceService>();
		services.AddScoped<IFinedayResidenceEndpointProvider, FinedayResidenceEndpointProvider>();
		services.AddSingleton<IFinedayResidenceMemoryCache, FinedayResidenceMemoryCache>();

		//-- Netatmo
		services.AddScoped(x => DomainConfig.Netatmo);
		services.AddScoped<INetatmoService, NetatmoService>();
		services.AddScoped<INetatmoEndpointProvider, NetatmoEndpointProvider>();
		services.AddSingleton<INetatmoMemoryCache, NetatmoMemoryCache>();

		services.AddScoped<NetatmoDbContext>();
		services.AddScoped<INetatmoRepository, NetatmoRepository>();
		
		//-- Innoflex
		services.AddScoped<IInnoflexService, InnoflexService>();
		services.AddScoped<IInnoflexEndpointProvider, InnoflexEndpointProvider>(x =>
		{
			return new InnoflexEndpointProvider(
				DomainConfig.Innoflex,
				x.GetRequiredService<IHttpClientFactory>(),
				x.GetRequiredService<ILogger<InnoflexEndpointProvider>>());
		});
		services.AddSingleton<INetatmoMemoryCache, NetatmoMemoryCache>();

		//-- CarparkPayment
		services.AddScoped(x => DomainConfig.CarparkPayment);
		services.AddScoped<ICarparkPaymentService, CarparkPaymentService>();
		services.AddScoped<ICarparkPaymentEndpointProvider, CarparkPaymentEndpointProvider>();

		//-- ServiceMind
		services.AddScoped(x => DomainConfig.Residential);
		services.AddScoped<IServiceMindResidential, ServiceMindResidentialService>();
		services.AddScoped<IServiceMindResidentialEndpointProvider, ServiceMindResidentialEndpointProvider>();
		services.AddSingleton<IServiceMindResidentialMemoryCache, ServiceMindResidentialMemoryCache>();

		//-- LogPose
		services.AddScoped(x => DomainConfig.LBS);
		services.AddScoped<ILogPoseService, LogPoseService>();
		//services.AddScoped<ILogPoseEndpointProvider, LogPoseEndpointProvider>();
		//services.AddSingleton<ILogPoseMemoryCache, LogPoseMemoryCache>();

		//-- MT
		services.AddScoped(x => DomainConfig.MT);
		services.AddScoped<IMTService, MTService>();
		services.AddScoped<IMTEndpointProvider, MTEndpointProvider>();

		//-- EV
		services.AddScoped(x => DomainConfig.EV);
		services.AddScoped<IEVService, EVService>();
		services.AddScoped<IEVEndpointProvider, EVEndpointProvider>();

		//-- Payment
		services.AddScoped(x => DomainConfig.Payment);
		services.AddScoped<IPaymentService, PaymentService>();
		services.AddScoped<IPaymentEndpointProvider, PaymentEndpointProvider>();

		services.AddScoped<LogPoseDbContext>();
		services.AddScoped<ILogPoseRepository, LogPoseRepository>();

		//-- MemoryCache
		services.AddSingleton<IMemoryCache, MemoryCache>(x =>
		{
			return new MemoryCache(new MemoryCacheOptions());
		});

		services.AddStackExchangeRedisCache(options =>
    {
        options.Configuration = DomainConfig.Redis.GetRedisConnectionString();
    });

		services.AddTransient<IRedisService, RedisService>();

		return services;
	}

}
