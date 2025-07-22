using Microsoft.Extensions.DependencyInjection;
using System.Reflection;
using TCCTOBK.OperationBackend.Application.Helper.FCMNotification.Service;

namespace TCCTOBK.OperationBackend.Application;
public static class ApplicationServiceRegistration
{
	public static IServiceCollection AddApplicationService(this IServiceCollection services)
	{
		services.AddMediatR(x =>
		{
			x.RegisterServicesFromAssembly(Assembly.GetExecutingAssembly());
		});

		services.AddTransient<IMailService, MailService>();
		services.AddTransient<IFCMNotificationService, FCMNotificationService>();
		return services;
	}
}
