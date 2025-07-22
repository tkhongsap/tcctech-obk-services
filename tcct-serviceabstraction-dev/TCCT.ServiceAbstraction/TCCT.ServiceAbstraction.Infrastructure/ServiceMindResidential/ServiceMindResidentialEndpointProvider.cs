using System.Net.Http.Headers;
using TCCT.ServiceAbstraction.Application.Contracts.ServiceMindResidential;
using TCCT.ServiceAbstraction.Domain;
using System.Net.Http.Json;
using TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Command.AuthorizeTenant;
using TCCT.ServiceAbstraction.Application.Exceptions;
using System.Net;
using System.Text.Json;
using Microsoft.Extensions.Logging;
using TCCT.ServiceAbstraction.Infrastructure.FinedayIviva;

namespace TCCT.ServiceAbstraction.Infrastructure.ServiceMindResidential;

public partial class ServiceMindResidentialEndpointProvider(ResidentialConfig config, IHttpClientFactory httpclientfactory, IServiceMindResidentialMemoryCache cache, ILogger<ServiceMindResidentialEndpointProvider> logger) : IServiceMindResidentialEndpointProvider
{
	private IServiceMindResidentialMemoryCache _cache = cache;
	private ResidentialConfig _config = config;
	private IHttpClientFactory _httpclientfactory = httpclientfactory;
	private readonly ILogger<ServiceMindResidentialEndpointProvider> _logger = logger;

	public HttpClient GetClientFromFactory() => _httpclientfactory.CreateClient("ignoressl");

	private async Task<AuthorizeTenantResult> GetClientCredential(string? tenantId)
	{
		var endpoint = GetLoginLoginUrl();
		var tenant = tenantId == null ? _config.DefaultTenant : tenantId;

		var httpres = await GetClientFromFactory().PostAsJsonAsync(endpoint, new
		{
			_config.ClientSecret,
			tenantId = tenant
		});
		var resbody = await httpres.Content.ReadAsStringAsync();
		LoggerService.LogRequestAndResponse(_logger, httpres, resbody);
		if (httpres.StatusCode == HttpStatusCode.BadRequest) throw ServiceMindResidentialServiceException.SMS002(resbody);
		if (!httpres.IsSuccessStatusCode) throw ServiceMindResidentialServiceException.SMS001(resbody);
		var res = JsonSerializer.Deserialize<AuthorizeTenantResult>(resbody)!;
		return res!;
	}

	public async Task<AuthorizeTenantResult> AuthorizeTenant(string? tenantId)
	{
		return await _cache.GetTokenCache(GetClientCredential, tenantId);
	}

	public async Task<HttpClient> GetClientFromFactoryWithBearer(string? tenantId)
	{
		var login = await _cache.GetTokenCache(GetClientCredential, tenantId);

		var client = GetClientFromFactory();
		client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", login.accessToken);
		return client;
	}
	public string GetClientSecret()
	{
		return _config.ClientSecret;
	}
	public string GetLoginLoginUrl()
	{
		return $"{_config.EndPoint}/client/auth/authorize-tenant";
	}

	public string GetHouseRulesUrl()
	{
		return $"{_config.EndPoint}/client/house-rules";
	}

	public string GetHouseRulesCategoriesUrl()
	{
		return $"{_config.EndPoint}/client/house-rules/categories";
	}

	public string GetHomeUrl()
	{
		return $"{_config.EndPoint}/client/tenant/app-home";
	}

	public string GetDirectoryContactsUrl()
	{
		return $"{_config.EndPoint}/client/directory-contacts";
	}

	public string GetPropertiesUrl()
	{
		return $"{_config.EndPoint}/client/tenant/properties";
	}

	public string GetDefaultPropertyUrl()
	{
		return $"{_config.EndPoint}/client/tenant/properties/get-default-property";
	}

	public string GetProfileUrl()
	{
		return $"{_config.EndPoint}/client/profile/me";
	}

	public string UpdateDefaultPropertyUrl()
	{
		return $"{_config.EndPoint}/client/tenant/properties/update-default-property";
	}

	public string GetAnnouncementsUrl()
	{
		return $"{_config.EndPoint}/client/announcements";
	}

	public string RegisterNewTenantUrl()
	{
		return $"{_config.EndPoint}/client/auth/new-tenant-registration";
	}

	public string GetRegisteredVehiclesUrl()
	{
		return $"{_config.EndPoint}/client/car-parking/get-registered-vehicles";
	}

	public string GetCarParkingQuotaUnitWiseUrl()
	{
		return $"{_config.EndPoint}/client/car-parking/get-car-parking-quota-unit-wise";
	}

	public string GetCarParkingQuotaUrl()
	{
		return $"{_config.EndPoint}/client/car-parking/get-car-parking-quota-total-combined";
	}

	public string AddVisitorUrl()
	{
		return $"{_config.EndPoint}/client/visitors/add";
	}

	public string GetVisitorListUrl()
	{
		return $"{_config.EndPoint}/client/visitors/list";
	}

	public string GetVisitorDetailsUrl()
	{
		return $"{_config.EndPoint}/client/visitors/details";
	}
	public string UpdateVisitorStatusUrl()
	{
		return $"{_config.EndPoint}/client/visitors/update-status";
	}

	public string GetParcelsUrl()
	{
		return $"{_config.EndPoint}/client/parcel";
	}

	public string GetParcelStatusListUrl()
	{
		return $"{_config.EndPoint}/client/parcel/get-parcel-status-list";
	}

	public string UpdateParcelReadStatusUrl()
	{
		return $"{_config.EndPoint}/client/parcel/update-parcel-read-status";
	}

	public string GetTenantDetailsParcelUrl()
	{
		return $"{_config.EndPoint}/client/parcel/details";
	}

	public string GenerateNewPresignedUrl()
	{
		return $"{_config.EndPoint}/file-new/get-upload-url";
	}

	public string UploadImageUrl()
	{
		return $"{_config.EndPoint}/chat-images";
	}

	public string SaveLogsUrl()
	{
		return $"{_config.EndPoint}/client/logs-registry/save-logs";
	}

	public string GetTermsAndConditionsUrl()
	{
		return $"{_config.EndPoint}/client/car-parking/get-terms-and-conditions";
	}

	public string AddVisitorCarParkingLogUrl()
	{
		return $"{_config.EndPoint}/client/visitors/add-visitor-car-parking-log";
	}

	public string NotifyLiftArrivalUrl()
	{
		return $"{_config.EndPoint}/client/notifications/notify-lift-arrival";
	}

	public string GetCommonAreasUrl()
	{
		return $"{_config.EndPoint}/client/tenant/properties/get-common-areas";
	}

	public string GetStatusCodesUrl()
	{
		return $"{_config.EndPoint}/client/cm/maintenance-repair/status-codes";
	}

	public string GetEventTypesUrl()
	{
		return $"{_config.EndPoint}/client/cm/maintenance-repair/get-event-types";
	}

	public string GetMaintainanceRepairListUrl()
	{
		return $"{_config.EndPoint}/client/cm/maintenance-repair/list";
	}

	public string CreateMaintainanceRepairUrl()
	{
		return $"{_config.EndPoint}/client/cm/maintenance-repair/create";
	}

	public string GetServiceRequestStatusCodesUrl()
	{
		return $"{_config.EndPoint}/client/cm/service-request/status-codes";
	}

	public string GetServiceRequestEventTypesUrl()
	{
		return $"{_config.EndPoint}/client/cm/service-request/get-sr-types";
	}

	public string GetServiceRequestListUrl()
	{
		return $"{_config.EndPoint}/client/cm/service-request/list";
	}

	public string CreateServiceRequestUrl()
	{
		return $"{_config.EndPoint}/client/cm/service-request/create";
	}

	public string GetFeedbackStatusCodesUrl()
	{
		return $"{_config.EndPoint}/client/cm/feedback/status-codes";
	}

	public string GetFeedbackEventTypesUrl()
	{
		return $"{_config.EndPoint}/client/cm/feedback/get-feedback-types";
	}

	public string GetFeedbackListUrl()
	{
		return $"{_config.EndPoint}/client/cm/feedback/list";
	}

	public string CreateFeedbackUrl()
	{
		return $"{_config.EndPoint}/client/cm/feedback/create";
	}

	public string CaseUpdatesUrl()
	{
		return $"{_config.EndPoint}/client/cm/webhook/case-updates";
	}

	public string DeactivateVisitorPassUrl()
	{
		return $"{_config.EndPoint}/client/visitors/deactivate-visitor-pass";
	}
	public string GetQuestionnairesUrl()
	{
		return $"{_config.EndPoint}/client/questionnaire/list";
	}

	public string GetQuestionnaireDetailsUrl()
	{
		return $"{_config.EndPoint}/client/questionnaire/detail";
	}

	public string GetQuestionnaireHistoryUrl()
	{
		return $"{_config.EndPoint}/client/questionnaire/history";
	}

	public string SubmitQuestionnaireUrl()
	{
		return $"{_config.EndPoint}/client/questionnaire/submit";
	}

	public string OnboardingSyncUpdatesUrl()
	{
		return $"{_config.EndPoint}/client/innoflex/webhook/onboarding-sync-updates";
	}

	public string GeneratePromptPayQrUrl()
	{
		return $"{_config.EndPoint}/client/payment/generate-prompt-pay-qr";
	}

	public string GetCallBackPaymentUrl()
	{
		return $"{_config.EndPoint}/client/payment/webhook/payment-status-callback";
	}

	public string GetPaymentTransactionUrl()
	{
		return $"{_config.EndPoint}/client/payment/get-transactions";
	}

	public string GetPaymentInquiryUrl()
	{
		return $"{_config.EndPoint}/client/payment/payment-inquiry";
	}

	public string GetLatestMeterReadingUrl()
	{
		return $"{_config.EndPoint}/client/meters-and-billing/get-latest-meter-reading";
	}

	public string GetBillingHistoryUrl()
	{
		return $"{_config.EndPoint}/client/meters-and-billing/get-billing-history";
	}

	public string GetInvoiceHistoryUrl()
	{
		return $"{_config.EndPoint}/client/meters-and-billing/get-invoice-history";
	}
	public string GetInvoiceDetailsUrl()
	{
		return $"{_config.EndPoint}/client/meters-and-billing/get-invoice-details";
	}
	public string GetReceiptDetailsUrl()
	{
		return $"{_config.EndPoint}/client/meters-and-billing/get-receipt-details";
	}
}