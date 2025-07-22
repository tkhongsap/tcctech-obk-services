using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.HttpLogging;
using Microsoft.OpenApi.Models;
using Serilog;
using System.Globalization;
using System.Net;
using TCCT.ServiceAbstraction.Api.Middleware;
using TCCT.ServiceAbstraction.Application;
using TCCT.ServiceAbstraction.Application.Exceptions;
using TCCT.ServiceAbstraction.Application.Features;
using TCCT.ServiceAbstraction.Domain;
using TCCT.ServiceAbstraction.Infrastructure;

var culture = new CultureInfo("en-Us");
culture.DateTimeFormat.ShortDatePattern = "dd/MM/yyyy";
culture.DateTimeFormat.LongTimePattern = "HH:mm:ss";
culture.DateTimeFormat.DateSeparator = "/";
culture.DateTimeFormat.TimeSeparator = ":";

culture.NumberFormat.NumberDecimalSeparator = ".";
culture.NumberFormat.NumberGroupSeparator = ",";
culture.NumberFormat.CurrencyGroupSeparator = ",";
culture.NumberFormat.CurrencySymbol = "";
CultureInfo.DefaultThreadCurrentCulture = culture;
CultureInfo.DefaultThreadCurrentUICulture = culture;

var servicename = "Service Abstraction";
var builder = WebApplication.CreateBuilder(args);

var configuration = builder.Configuration;

if (builder.Environment.IsDevelopment()) // if dev, read config from user secrets and put into environment variables
{
	configuration.GetSection(DomainConfig.SerilogConfigSection).Bind(DomainConfig.Serilog);
	configuration.GetSection(DomainConfig.CustomerKeycloakConfigSection).Bind(DomainConfig.Customer.Keycloak);
	configuration.GetSection(DomainConfig.OperationKeycloakConfigSection).Bind(DomainConfig.Operation.Keycloak);
	configuration.GetSection(DomainConfig.LoggerKeycloakConfigSection).Bind(DomainConfig.Logger.Keycloak);
	configuration.GetSection(DomainConfig.AirQualityConfigSection).Bind(DomainConfig.AirQuality);
	configuration.GetSection(DomainConfig.CertisConfigSection).Bind(DomainConfig.Certis);
	configuration.GetSection(DomainConfig.FinedayIvivaConfigSection).Bind(DomainConfig.FinedayIviva);
	configuration.GetSection(DomainConfig.FinedayResidenceConfigSection).Bind(DomainConfig.FinedayResidence);
	configuration.GetSection(DomainConfig.NetatmoConfigSection).Bind(DomainConfig.Netatmo);
	configuration.GetSection(DomainConfig.InnoflexConfigSection).Bind(DomainConfig.Innoflex);
	configuration.GetSection(DomainConfig.CarparkPaymentConfigSection).Bind(DomainConfig.CarparkPayment);
	configuration.GetSection(DomainConfig.ResidentialConfigSection).Bind(DomainConfig.Residential);
	configuration.GetSection(DomainConfig.LBSConfigSection).Bind(DomainConfig.LBS);
	configuration.GetSection(DomainConfig.MTConfigSection).Bind(DomainConfig.MT);
	configuration.GetSection(DomainConfig.RedisConfigSection).Bind(DomainConfig.Redis);
	configuration.GetSection(DomainConfig.EVConfigSection).Bind(DomainConfig.EV);
	configuration.GetSection(DomainConfig.PaymentConfigSection).Bind(DomainConfig.Payment);

	DomainConfig.Redis.SetEnvironmentVariables();
	DomainConfig.Serilog.SetEnvironmentVariables();
	DomainConfig.Customer.SetEnvironmentVariables();
	DomainConfig.Operation.SetEnvironmentVariables();
	DomainConfig.AirQuality.SetEnvironmentVariables();
	DomainConfig.Certis.SetEnvironmentVariables();
	DomainConfig.FinedayIviva.SetEnvironmentVariables();
	DomainConfig.FinedayResidence.SetEnvironmentVariables();
	DomainConfig.Netatmo.SetEnvironmentVariables();
	DomainConfig.Innoflex.SetEnvironmentVariables();
	DomainConfig.CarparkPayment.SetEnvironmentVariables();
	DomainConfig.Residential.SetEnvironmentVariables();
	DomainConfig.LBS.SetEnvironmentVariables();
	DomainConfig.MT.SetEnvironmentVariables();
	DomainConfig.Logger.SetEnvironmentVariables();
	DomainConfig.EV.SetEnvironmentVariables();
	DomainConfig.Payment.SetEnvironmentVariables();
}

DomainConfig.RunningEnvironment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT")!;
DomainConfig.Serilog.GetEnvironmentVariables();
DomainConfig.Customer.GetEnvironmentVariables();
DomainConfig.Operation.GetEnvironmentVariables();
DomainConfig.AirQuality.GetEnvironmentVariables();
DomainConfig.Certis.GetEnvironmentVariables();
DomainConfig.FinedayIviva.GetEnvironmentVariables();
DomainConfig.FinedayResidence.GetEnvironmentVariables();
DomainConfig.Netatmo.GetEnvironmentVariables();
DomainConfig.Innoflex.GetEnvironmentVariables();
DomainConfig.CarparkPayment.GetEnvironmentVariables();
DomainConfig.Residential.GetEnvironmentVariables();
DomainConfig.LBS.GetEnvironmentVariables();
DomainConfig.MT.GetEnvironmentVariables();
DomainConfig.Redis.GetEnvironmentVariables();
DomainConfig.Logger.GetEnvironmentVariables();
DomainConfig.EV.GetEnvironmentVariables();
DomainConfig.Payment.GetEnvironmentVariables();

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(x =>
{
	x.EnableAnnotations();
	x.CustomSchemaIds(type => type.ToString());
	x.SwaggerDoc("lbsv1", new OpenApiInfo
	{
		Version = "v1",
		Title = $"[{servicename}] LBS API (" + DomainConfig.RunningEnvironment + ")",
	});
	x.SwaggerDoc("airqualityv1", new OpenApiInfo
	{
		Version = "v1",
		Title = $"[{servicename}] Air Quality API (" + DomainConfig.RunningEnvironment + ")",
	});
	x.SwaggerDoc("customerv1", new OpenApiInfo
	{
		Version = "v1",
		Title = $"[{servicename}] Customer API (" + DomainConfig.RunningEnvironment + ")",
	});
	x.SwaggerDoc("operationv1", new OpenApiInfo
	{
		Version = "v1",
		Title = $"[{servicename}] Operation API (" + DomainConfig.RunningEnvironment + ")",
	});
	x.SwaggerDoc("certismasterv1", new OpenApiInfo
	{
		Version = "v1",
		Title = $"[{servicename}] Certis Master API (" + DomainConfig.RunningEnvironment + ")",
	});
	x.SwaggerDoc("certistransactionv1", new OpenApiInfo
	{
		Version = "v1",
		Title = $"[{servicename}] Certis Transaction API (" + DomainConfig.RunningEnvironment + ")",
	});
	x.SwaggerDoc("finedayivivav1", new OpenApiInfo
	{
		Version = "v1",
		Title = $"[{servicename}] Fineday Iviva API (" + DomainConfig.RunningEnvironment + ")",
	});
	x.SwaggerDoc("finedayresidencev1", new OpenApiInfo
	{
		Version = "v1",
		Title = $"[{servicename}] Fineday Residence API (" + DomainConfig.RunningEnvironment + ")",
	});
	x.SwaggerDoc("netatmov1", new OpenApiInfo
	{
		Version = "v1",
		Title = $"[{servicename}] Netatmo API (" + DomainConfig.RunningEnvironment + ")",
	});
	x.SwaggerDoc("innoflexv1", new OpenApiInfo
	{
		Version = "v1",
		Title = $"[{servicename}] Innoflex API (" + DomainConfig.RunningEnvironment + ")",
	});
	x.SwaggerDoc("carparkpaymentv1", new OpenApiInfo
	{
		Version = "v1",
		Title = $"[{servicename}] Carpark Payment API (" + DomainConfig.RunningEnvironment + ")",
	});
	x.SwaggerDoc("residentialv1", new OpenApiInfo
	{
		Version = "v1",
		Title = $"[{servicename}] Residential API (" + DomainConfig.RunningEnvironment + ")",
	});
	x.SwaggerDoc("toolv1", new OpenApiInfo
	{
		Version = "v1",
		Title = $"[{servicename}] Tools API (" + DomainConfig.RunningEnvironment + ")",
	});
	x.SwaggerDoc("mtv1", new OpenApiInfo
	{
		Version = "v1",
		Title = $"[{servicename}] MT Service API (" + DomainConfig.RunningEnvironment + ")",
	});
	x.SwaggerDoc("evv1", new OpenApiInfo
	{
		Version = "v1",
		Title = $"[{servicename}] EV Service API (" + DomainConfig.RunningEnvironment + ")",
	});
	x.SwaggerDoc("paymentv1", new OpenApiInfo
	{
		Version = "v1",
		Title = $"[{servicename}] Payment Service API (" + DomainConfig.RunningEnvironment + ")",
	});
});

builder.Services.AddApplicationService();
builder.Services.AddInfrastructureService(builder.Configuration);

builder.Host.UseSerilog((ctx, lc) =>
{
	lc.ReadFrom.Configuration(ctx.Configuration);
	lc.Enrich.WithProperty("ApplicationName", servicename);
	lc.WriteTo.Console();

	if (!string.IsNullOrEmpty(DomainConfig.Serilog.EndPoint) && DomainConfig.Serilog.EndPoint != "{secret}") // ไม่กำหนด endpoint จะไม่ log ไปที่ Seq
	{
		lc.WriteTo.Seq(DomainConfig.Serilog.EndPoint, apiKey: DomainConfig.Serilog.APIKey);
	}
});


var app = builder.Build();

app.Use(async (context, next) =>
{
	context.Request.EnableBuffering();
	await next();
});

app.UseMiddleware<LoggingMiddleware>();

app.UseSerilogRequestLogging(x =>
	{
		x.MessageTemplate = "{RealIP} {ConsumerUsername} {RequestHost} HTTP {RequestMethod} {RequestPath}{QueryString} responded {StatusCode} in {Elapsed:0.0000} ms {ExMessage}";
		x.EnrichDiagnosticContext = async (dc, context) =>
		{
			var realip = "";
			var xrealip = context.Request.Headers["X-Real-IP"];
			if (!Microsoft.Extensions.Primitives.StringValues.IsNullOrEmpty(xrealip)) realip = xrealip.ToString();
			dc.Set("RealIP", realip);

			var consumerusername = "";
			var xconsumerusername = context.Request.Headers["X-Consumer-Username"];
			if (!Microsoft.Extensions.Primitives.StringValues.IsNullOrEmpty(xconsumerusername)) consumerusername = xconsumerusername.ToString();
			dc.Set("ConsumerUsername", consumerusername);

			dc.Set("QueryString", context.Request.QueryString.Value);
			dc.Set("RequestHost", context.Request.Host.Value);
			dc.Set("RemoteIpAddress", context.Connection.RemoteIpAddress?.MapToIPv4());


			var exmessage = "";
			if (context.Items.TryGetValue("X-Error-Code", out var ecode)) exmessage += ecode!.ToString();
			if (context.Items.TryGetValue("X-Error-Message", out var emsg)) exmessage += " " + emsg!.ToString();
			if (context.Items.TryGetValue("X-Error-External", out var eexternal)) eexternal = eexternal!.ToString();
			dc.Set("ExMessage", exmessage);
			if (!string.IsNullOrEmpty(exmessage)) dc.Set("Technical", context.Items["X-Error-Techical"]);
			if (context.Response.StatusCode >= 400)
			{
				try
				{
					dc.Set("ExternalData", eexternal);
					context.Request.Body.Position = 0;
					using var streamReader = new StreamReader(context.Request.Body, leaveOpen: true);
					var requestbody = await streamReader.ReadToEndAsync();
					context.Request.Body.Position = 0;
					dc.Set("Body", requestbody);
				}
				catch (Exception ex)
				{
					dc.Set("ExException", ex);
				}
			}
		};
	}
);

if (app.Environment.IsDevelopment() || app.Environment.IsStaging())
{
	app.UseSwagger();
	app.UseSwaggerUI(x =>
	{
		x.SwaggerEndpoint("/swagger/lbsv1/swagger.json", "LBS v1");
		x.SwaggerEndpoint("/swagger/carparkpaymentv1/swagger.json", "Carpark Payment v1");
		x.SwaggerEndpoint("/swagger/airqualityv1/swagger.json", "Air Quality v1");
		x.SwaggerEndpoint("/swagger/customerv1/swagger.json", "Customer v1");
		x.SwaggerEndpoint("/swagger/operationv1/swagger.json", "Operation v1");
		x.SwaggerEndpoint("/swagger/certismasterv1/swagger.json", "Certis Master v1");
		x.SwaggerEndpoint("/swagger/certistransactionv1/swagger.json", "Certis Transaction v1");
		x.SwaggerEndpoint("/swagger/finedayivivav1/swagger.json", "Fineday (Iviva) v1");
		x.SwaggerEndpoint("/swagger/finedayresidencev1/swagger.json", "Fineday (Residence) v1");
		x.SwaggerEndpoint("/swagger/netatmov1/swagger.json", "Netatmo v1");
		x.SwaggerEndpoint("/swagger/innoflexv1/swagger.json", "Innoflex v1");
		x.SwaggerEndpoint("/swagger/residentialv1/swagger.json", "Residential v1");
		x.SwaggerEndpoint("/swagger/toolv1/swagger.json", "Tools v1");
		x.SwaggerEndpoint("/swagger/mtv1/swagger.json", "MT Service v1");
		x.SwaggerEndpoint("/swagger/evv1/swagger.json", "EV Service v1");
		x.SwaggerEndpoint("/swagger/paymentv1/swagger.json", "Payment v1");

	});
}

app.UseAuthorization();
app.MapControllers();


app.UseExceptionHandler(x =>
{
	x.Run(async context =>
	 {
		var ex = context.Features.Get<IExceptionHandlerFeature>();
		if (ex != null)
		{
			var logger = context.RequestServices.GetRequiredService<ILogger<Program>>();
			var technical = ex.Error.ToString();
			var errres = new FailedResult();
			var ssex = ex.Error as ServiceAbstractionException;
			if (ssex != null)
			{
				errres.ErrorCode = ssex.Code;
				errres.ErrorDetail = ssex.Message;
				if (!builder.Environment.IsProduction())
				 {
					 errres.Technical = ssex.ToString();
				 }
				 logger.LogError("[Unexpect Error] Code: {ErrorCode}, Detail: {ErrorDetail}",
						errres.ErrorCode, errres.ErrorDetail);

			 }
			 else
			{
				errres.ErrorCode = "SAE000"; // unknow excpetion
				errres.ErrorDetail = ex.Error.Message;
				if (!builder.Environment.IsProduction())
				{
					errres.Technical = ex.Error.ToString();
				}
				 logger.LogError("[Unknow Error] Message: {Message}",
						ex.Error.Message);
			 }

			 context.Response.ContentType = "application/json";
			context.Items.Add("X-Error-Code", errres.ErrorCode);
			context.Items.Add("X-Error-Message", errres.ErrorDetail);
			context.Items.Add("X-Error-Techical", technical);
			context.Items.Add("X-Error-External", ex.Error?.InnerException?.Message ?? "");

			//if (errres.ErrorCode == KeycloakServiceException.KCS001.Code)
			//{
			//	context.Response.StatusCode = (int)HttpStatusCode.Unauthorized;
			//}
			//else
			//{
			context.Response.StatusCode = ssex.Status != null ? (int)ssex.Status : (int)HttpStatusCode.InternalServerError;
			//}
			await context.Response.WriteAsJsonAsync(errres);
		}
	});
});

app.Run();
