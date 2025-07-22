using Amazon.SimpleEmail;
using Autofac;
using Autofac.Extensions.DependencyInjection;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Minio;
using Serilog;
using System.Globalization;
using System.Security.Claims;
using System.Text;
using TCCTOBK.OperationBackend.Api;
using TCCTOBK.OperationBackend.Api.Middleware;
using TCCTOBK.OperationBackend.Api.Service;
using TCCTOBK.OperationBackend.Application;
using TCCTOBK.OperationBackend.Application.Configuration.Jwt;
using TCCTOBK.OperationBackend.Application.Helper.Service;
using TCCTOBK.OperationBackend.Application.Repositories;
using TCCTOBK.OperationBackend.Domain;
using TCCTOBK.OperationBackend.Infrastructure;

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

var servicename = "Operation";
var builder = WebApplication.CreateBuilder(args);
var configuration = builder.Configuration;

if (builder.Environment.IsDevelopment()) // if dev, read config from user secrets and put into environment variables
{
	configuration.GetSection(DomainConfig.SerilogConfigSection).Bind(DomainConfig.Serilog);
	configuration.GetSection(DomainConfig.KongConfigSection).Bind(DomainConfig.Kong);
	configuration.GetSection(DomainConfig.MailConfigSection).Bind(DomainConfig.Mail);
	configuration.GetSection(DomainConfig.CMSDBConfigSection).Bind(DomainConfig.CMSDB);
	configuration.GetSection(DomainConfig.CMSAPIConfigSection).Bind(DomainConfig.CMSAPI);
	configuration.GetSection(DomainConfig.AbstractionConfigSection).Bind(DomainConfig.Abstraction);
	configuration.GetSection(DomainConfig.OauthConfigSection).Bind(DomainConfig.Oauth);
	configuration.GetSection(DomainConfig.FirebaseAdminConfigSection).Bind(DomainConfig.FirebaseAdmin);
	configuration.GetSection(DomainConfig.MinioConfigSection).Bind(DomainConfig.Minio);
	configuration.GetSection(DomainConfig.ReportConfigSection).Bind(DomainConfig.Report);
	configuration.GetSection(DomainConfig.CMSConfigSection).Bind(DomainConfig.CMS);
	configuration.GetSection(DomainConfig.RedisConfigSection).Bind(DomainConfig.Redis);
	configuration.GetSection(DomainConfig.OpsAppConfigSection).Bind(DomainConfig.OpsApp);
	configuration.GetSection(DomainConfig.FirebaseFCMSection).Bind(DomainConfig.FCM);
	DomainConfig.Serilog.SetEnvironmentVariables();
	DomainConfig.Kong.SetEnvironmentVariables();
	DomainConfig.Mail.SetEnvironmentVariables();
	DomainConfig.CMSDB.SetEnvironmentVariables();
	DomainConfig.CMSAPI.SetEnvironmentVariables();
	DomainConfig.Abstraction.SetEnvironmentVariables();
	DomainConfig.Oauth.SetEnvironmentVariables();
	DomainConfig.FirebaseAdmin.SetEnvironmentVariables();
	DomainConfig.Minio.SetEnvironmentVariables();
	DomainConfig.Report.SetEnvironmentVariables();
	DomainConfig.CMS.SetEnvironmentVariables();
	DomainConfig.Redis.SetEnvironmentVariables();
	DomainConfig.OpsApp.SetEnvironmentVariables();
	DomainConfig.FCM.SetEnvironmentVariables();
}

DomainConfig.RunningEnvironment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT")!;
DomainConfig.Serilog.GetEnvironmentVariables();
DomainConfig.Mail.GetEnvironmentVariables();
DomainConfig.Kong.GetEnvironmentVariables();
DomainConfig.CMSDB.GetEnvironmentVariables();
DomainConfig.CMSAPI.GetEnvironmentVariables();
DomainConfig.Abstraction.GetEnvironmentVariables();
DomainConfig.Oauth.GetEnvironmentVariables();
DomainConfig.FirebaseAdmin.GetEnvironmentVariables();
DomainConfig.Minio.GetEnvironmentVariables();
DomainConfig.Report.GetEnvironmentVariables();
DomainConfig.CMS.GetEnvironmentVariables();
DomainConfig.Redis.GetEnvironmentVariables();
DomainConfig.OpsApp.GetEnvironmentVariables();
DomainConfig.FCM.GetEnvironmentVariables();

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(x =>
{
	x.CustomSchemaIds(type => type.ToString());
	x.EnableAnnotations();
	x.SwaggerDoc("cmsv1", new OpenApiInfo
	{
		Version = "v1",
		Title = $"[{servicename}] CMS API (" + DomainConfig.RunningEnvironment + ")",
	});
	x.SwaggerDoc("operationv1", new OpenApiInfo
	{
		Version = "v1",
		Title = $"[{servicename}] Operation API (" + DomainConfig.RunningEnvironment + ")",
	});
	x.SwaggerDoc("aochmapv1", new OpenApiInfo
	{
		Version = "v1",
		Title = $"[{servicename}] Operation API (" + DomainConfig.RunningEnvironment + ")",
	});
	x.SwaggerDoc("toolv1", new OpenApiInfo
	{
		Version = "v1",
		Title = $"[{servicename}] Tools API (" + DomainConfig.RunningEnvironment + ")",
	});
	x.SwaggerDoc("operationmobilev1", new OpenApiInfo
	{
		Version = "v1",
		Title = $"[{servicename}] Operation Mobile API (" + DomainConfig.RunningEnvironment + ")",
	});
	x.SwaggerDoc("socv1", new OpenApiInfo
	{
		Version = "v1",
		Title = $"[{servicename}] Guard Tour API (" + DomainConfig.RunningEnvironment + ")",
	});
	x.SwaggerDoc("sustainabilityv1", new OpenApiInfo
	{
		Version = "v1",
		Title = $"[{servicename}] Sustainability API (" + DomainConfig.RunningEnvironment + ")",
	});
	x.SwaggerDoc("marcomv1", new OpenApiInfo
	{
		Version = "v1",
		Title = $"[{servicename}] Marcom API (" + DomainConfig.RunningEnvironment + ")",
	});
	x.SwaggerDoc("lbsv1", new OpenApiInfo
	{
		Version = "v1",
		Title = $"[{servicename}] LBS API (" + DomainConfig.RunningEnvironment + ")",
	});
	x.SwaggerDoc("batchcallv1", new OpenApiInfo
	{
		Version = "v1",
		Title = $"[{servicename}] Batch Call API (" + DomainConfig.RunningEnvironment + ")",
	});

    x.SwaggerDoc("urgent", new OpenApiInfo
	{
		Version = "v1",
		Title = $"[{servicename}] (" + DomainConfig.RunningEnvironment + ")",
	});



	x.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
	{
		In = ParameterLocation.Header,
		Description = "Please enter a valid token",
		Name = "Authorization",
		Type = SecuritySchemeType.Http,
		BearerFormat = "JWT",
		Scheme = JwtBearerDefaults.AuthenticationScheme
	});
	x.AddSecurityRequirement(new OpenApiSecurityRequirement
	{
		{
			new OpenApiSecurityScheme
			{
				Reference = new OpenApiReference
				{
					Type = ReferenceType.SecurityScheme,
					Id = "Bearer"
				}
			},
			new string[] {}
		}
	});
});

builder.Services.Configure<IdentityOptions>(options =>
{
	options.ClaimsIdentity.RoleClaimType = OBKClaimType.Role;
});

builder.Services.AddAuthentication(options =>
{
	options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
	options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
	options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
	options.SaveToken = true;
	options.RequireHttpsMetadata = false;
	options.TokenValidationParameters = new TokenValidationParameters()
	{
		ValidateIssuer = false,
		ValidateAudience = false,
		ValidateLifetime = false,
		ValidateIssuerSigningKey = false,
		RequireExpirationTime = false,
		RequireSignedTokens = false,
		IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(DomainConfig.Kong.ConsumerSecret)),
		ClockSkew = TimeSpan.Zero,
		RoleClaimType = OBKClaimType.Role,
		NameClaimType = ClaimTypes.NameIdentifier,
	};
});

builder.Host.UseServiceProviderFactory(new AutofacServiceProviderFactory());
builder.Host.ConfigureContainer<ContainerBuilder>(builder => builder.RegisterAssemblyTypes(typeof(BaseRepository).Assembly).Where(t => t.Name.EndsWith("Repository")).AsImplementedInterfaces());
builder.Host.ConfigureContainer<ContainerBuilder>(builder => builder.RegisterAssemblyTypes(typeof(BaseRepository<>).Assembly).Where(t => t.Name.EndsWith("Repository")).AsImplementedInterfaces());

//services.AddAuthentication(o =>
//{
//	o.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
//	o.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
//})
//.AddJwtBearer(o =>
//{
//	o.RequireHttpsMetadata = false;
//	o.SaveToken = true;
//	o.TokenValidationParameters = new TokenValidationParameters
//	{
//		ValidateIssuer = false,
//		ValidateAudience = false,
//		ValidateIssuerSigningKey = false,
//		ValidateLifetime = false,
//		RequireExpirationTime = false,
//		RequireSignedTokens = false
//	};
//});


builder.Services.AddApplicationService();
builder.Services.AddInfrastructureService(builder.Configuration);

builder.Host.UseSerilog((ctx, lc) =>
{
	lc.ReadFrom.Configuration(ctx.Configuration);
	lc.Enrich.WithProperty("ApplicationName", servicename);
	lc.WriteTo.Console();

	if (!string.IsNullOrEmpty(DomainConfig.Serilog.EndPoint) && DomainConfig.Serilog.EndPoint != "{secret}") // ???????? endpoint ????? log ????? Seq
	{
		lc.WriteTo.Seq(DomainConfig.Serilog.EndPoint, apiKey: DomainConfig.Serilog.APIKey);
	}
});

builder.Services.AddHostedService<Worker>();

builder.Services.AddDefaultAWSOptions(builder.Configuration.GetAWSOptions());
builder.Services.AddAWSService<IAmazonSimpleEmailService>();
builder.Services.TryAddSingleton<IHttpContextAccessor, HttpContextAccessor>();
builder.Services.AddTransient<IAuditableService, AuditableService>();
builder.Services.AddTransient<IClientSiteService, ClientSiteService>();
builder.Services.AddTransient<ClientSiteMiddleware>();

// Sustainability
builder.Services.AddScoped<ISustainability, SustainabilityService>();

var accessKey = DomainConfig.Minio.AccessKey;
var secretKey = DomainConfig.Minio.SecretKey;
var endpoint = DomainConfig.Minio.Host;

builder.Services.AddMinio(configureClient => configureClient
	.WithEndpoint(endpoint)
	.WithCredentials(accessKey, secretKey)
	.WithSSL(true)
	.Build());

var app = builder.Build();

app.Use(async (context, next) =>
{
	context.Request.EnableBuffering();
	await next();
});

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
		dc.Set("ExMessage", exmessage);

		if (context.Response.StatusCode == 400 || context.Response.StatusCode == 500)
		{
			context.Request.Body.Position = 0;
			using var streamReader = new StreamReader(context.Request.Body, leaveOpen: true);
			var requestbody = await streamReader.ReadToEndAsync();
			context.Request.Body.Position = 0;

			dc.Set("Body", requestbody);
		}
	};
}
);

app.UseCors(builder => builder
		 .AllowAnyOrigin()
		 .AllowAnyMethod()
		 .AllowAnyHeader());

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment() || app.Environment.IsStaging())
{
	app.UseSwagger();
	app.UseSwaggerUI(x =>
    {
        x.SwaggerEndpoint("/swagger/cmsv1/swagger.json", "CMS v1");
        x.SwaggerEndpoint("/swagger/operationv1/swagger.json", "Operation v1");
        x.SwaggerEndpoint("/swagger/aochmapv1/swagger.json", "AOCHMAP v1");
        x.SwaggerEndpoint("/swagger/toolv1/swagger.json", "Tools v1");
        x.SwaggerEndpoint("/swagger/operationmobilev1/swagger.json", "Operation Mobile v1");
        x.SwaggerEndpoint("/swagger/socv1/swagger.json", "Guard Tour v1");
        x.SwaggerEndpoint("/swagger/sustainabilityv1/swagger.json", "Sustainability v1");
        x.SwaggerEndpoint("/swagger/marcomv1/swagger.json", "Marcom v1");
        x.SwaggerEndpoint("/swagger/lbsv1/swagger.json", "LBS v1");
        x.SwaggerEndpoint("/swagger/batchcallv1/swagger.json", "BatchCall v1");
        x.SwaggerEndpoint("/swagger/urgent/swagger.json", "Urgent v1");
	});
}

app.UseAuthorization();
app.UseMiddleware<ExceptionMiddleware>();
app.UseMiddleware<AudiableMiddleware>();
// app.UseMiddleware<ClientSiteMiddleware>();
app.MapControllers();

//app.UseExceptionHandler(x =>
//{
//	x.Run(async context =>
//	{
//		var ex = context.Features.Get<IExceptionHandlerFeature>();
//		if (ex != null)
//		{
//			context.Response.ContentType = "application/json";
//			context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;

//			var ssex = ex.Error as OperationBackendException;
//			if (ssex != null)
//			{
//				var errres = new FailedResult();
//				errres.ErrorCode = ssex.Code;
//				errres.ErrorDetail = ssex.Message;
//				await context.Response.WriteAsJsonAsync(errres);
//			}
//			else
//			{
//				var errres = new FailedResult();
//				errres.ErrorCode = "OBE000"; // unknow excpetion
//				errres.ErrorDetail = ex.Error.ToString();
//				await context.Response.WriteAsJsonAsync(errres);
//			}
//		}
//	});
//});

app.Run();
