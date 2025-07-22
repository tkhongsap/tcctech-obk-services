using Microsoft.Extensions.DependencyInjection;
using System.Reflection;

namespace TCCT.ServiceAbstraction.Application;
public static class ApplicationServiceRegistration
{
	public static IServiceCollection AddApplicationService(this IServiceCollection services)
	{
		services.AddMediatR(x =>
		{
			x.RegisterServicesFromAssembly(Assembly.GetExecutingAssembly());
		});
		return services;
	}
}
