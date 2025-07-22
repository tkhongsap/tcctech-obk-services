using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Minio;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Application.Contracts.API;
using TCCTOBK.OperationBackend.Application.Contracts.API.Abstraction;
using TCCTOBK.OperationBackend.Application.Contracts.Minio;
using TCCTOBK.OperationBackend.Application.Repositories;
using TCCTOBK.OperationBackend.Domain;
using TCCTOBK.OperationBackend.Infrastructure.API;
using TCCTOBK.OperationBackend.Infrastructure.Database;
using TCCTOBK.OperationBackend.Infrastructure.ObjectStorage;
using TCCTOBK.OperationBackend.Infrastructure.Repositories;

namespace TCCTOBK.OperationBackend.Infrastructure;
public static class InfrastructureServiceRegistration
{
	public static IServiceCollection AddInfrastructureService(this IServiceCollection services, IConfiguration configuration)
	{
		{
			var connstr = DomainConfig.CMSDB.GetPostgreSQLConnectionString();
			services.AddDbContext<TCCTOBKContext>(x =>
			{
				x.UseQueryTrackingBehavior(QueryTrackingBehavior.NoTracking);
				x.UseNpgsql(connstr, x =>
				{
					x.CommandTimeout(180);
					x.MigrationsAssembly(typeof(TCCTOBKContext).Assembly.FullName);
				});
			});

			AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);
			//services.AddScoped<AuditableEntitySaveChangesInterceptor>();
			services.AddScoped<ITCCTOBKContext>(provider => provider.GetRequiredService<TCCTOBKContext>());
		}

		services.AddScoped<IUnitOfWork, UnitOfWork>();
		services.AddScoped<IOPAPPUnitOfWork, OPAPPUnitOfWork>();
		services.AddScoped<IAbstractionService, AbstractionService>();
		services.AddScoped<IMinioService, MinioService>();
		services.AddScoped<IMasterDataService, MasterDataService>();
		services.AddTransient<IAPIService, APIService>();

		//-- MemoryCache
		services.AddSingleton<IMemoryCache, MemoryCache>(x =>
		{
			return new MemoryCache(new MemoryCacheOptions());
		});

		services.AddStackExchangeRedisCache(options =>
		{
			options.Configuration = DomainConfig.Redis.GetRedisConnectionString();
		});

		return services;
	}

}
