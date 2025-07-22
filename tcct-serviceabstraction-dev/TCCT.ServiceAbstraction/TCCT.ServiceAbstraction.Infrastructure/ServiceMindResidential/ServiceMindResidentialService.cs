using Microsoft.Extensions.Logging;
using System.Net.Http.Json;
using System.Text;
using System.Text.Json;
using TCCT.ServiceAbstraction.Application.Contracts.ServiceMindResidential;
using TCCT.ServiceAbstraction.Application.Exceptions;
using TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Command.AddVisitor;
using TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Command.AddVisitorCarParkingLog;
using TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Command.AuthorizeTenant;
using TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Command.CaseUpdates;
using TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Command.CreateFeedback;
using TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Command.CreateMaintainanceRepair;
using TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Command.CreateServiceRequest;
using TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Command.DeactivateVisitorPass;
using TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Command.GenerateNewPresigned;
using TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Command.GeneratePromptPayQr;
using TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Command.GetBillingHistory;
using TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Command.GetCallBackPayment;
using TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Command.GetEventTypes;
using TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Command.GetFeedbackEventTypes;
using TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Command.GetFeedbackList;
using TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Command.GetInvoiceHistory;
using TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Command.GetLatestMeterReading;
using TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Command.GetMaintainanceRepairList;
using TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Command.GetPaymentInquiry;
using TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Command.GetPaymentTransaction;
using TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Command.GetServiceRequestEventTypes;
using TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Command.GetServiceRequestList;
using TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Command.OnboardingSyncUpdates;
using TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Command.RegisterNewTenant;
using TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Command.SaveLogs;
using TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Command.SubmitQuestionnaire;
using TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Command.UpdateDefaultProperty;
using TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Command.UpdateParcelReadStatus;
using TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Command.UpdateVisitorStatus;
using TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Command.UploadImageUrl;
using TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Models.RegisterNewTenant;
using TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Query.GetAnnouncementDetails;
using TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Query.GetAnnouncements;
using TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Query.GetCarParkingQuota;
using TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Query.GetCarParkingQuotaUnitWise;
using TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Query.GetCommonAreas;
using TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Query.GetDefaultProperty;
using TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Query.GetDirectoryContacts;
using TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Query.GetFeedbackStatusCodes;
using TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Query.GetHome;
using TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Query.GetHouseRules;
using TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Query.GetHouseRulesCategories;
using TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Query.GetInvoiceDetails;
using TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Query.GetParcels;
using TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Query.GetParcelStatusList;
using TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Query.GetProfile;
using TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Query.GetPropertieDetails;
using TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Query.GetPropertiesList;
using TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Query.GetQuestionnaireDetail;
using TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Query.GetQuestionnaireHistory;
using TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Query.GetQuestionnaires;
using TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Query.GetReceiptDetails;
using TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Query.GetRegisteredVehicles;
using TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Query.GetServiceRequestStatusCodes;
using TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Query.GetStatusCodes;
using TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Query.GetTenantDetailsParcel;
using TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Query.GetTermsAndConditions;
using TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Query.GetVisitorDetails;
using TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Query.GetVisitorList;
using TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Query.NotifyLiftArrival;
using TCCT.ServiceAbstraction.Application.Features.ServiceMindResidentialResponse;

namespace TCCT.ServiceAbstraction.Infrastructure.ServiceMindResidential;

public class ServiceMindResidentialService(IServiceMindResidentialEndpointProvider endpointprovider, ILogger<ServiceMindResidentialService> logger) : ServiceMindResidentialServiceBase, IServiceMindResidential
{
	private readonly IServiceMindResidentialEndpointProvider _endpointprovider = endpointprovider;
	private readonly ILogger<ServiceMindResidentialService> _logger = logger;

	public async Task<AuthorizeTenantResult> AuthorizeTenant(AuthorizeTenantCommand data)
	{
		return await _endpointprovider.AuthorizeTenant(data.TenantId);
	}

	public async Task<GetHouseRulesResult> GetHouseRules(GetHouseRulesQuery data)
	{
		var endpoint = _endpointprovider.GetHouseRulesUrl() + $"?page={data.Page}&limit={data.Limit}&name={data.Name}&categoryId={data.CategoryId}";

		var client = await _endpointprovider.GetClientFromFactoryWithBearer(data.TenantId);
		client.DefaultRequestHeaders.Add("lang", data.Lang);
		var httpres = await client.GetAsync(endpoint);
		var resbody = await httpres.Content.ReadAsStringAsync();
		LoggerService.LogRequestAndResponse(_logger, httpres, resbody);
		if (IsEmptyResult(resbody)) return new GetHouseRulesResult();
		var res = JsonSerializer.Deserialize<GetHouseRulesResult>(resbody)!;
		return res!;
	}

	public async Task<GetHouseRulesCategoriesResult> GetHouseRulesCategories(GetHouseRulesCategoriesQuery data)
	{
		var endpoint = _endpointprovider.GetHouseRulesCategoriesUrl() + $"?page={data.Page}&limit={data.Limit}&name={data.Name}&projectId={data.ProjectId}";

		var client = await _endpointprovider.GetClientFromFactoryWithBearer(data.TenantId);
		client.DefaultRequestHeaders.Add("lang", data.Lang);
		var httpres = await client.GetAsync(endpoint);
		var resbody = await httpres.Content.ReadAsStringAsync();
		LoggerService.LogRequestAndResponse(_logger, httpres, resbody);
		if (IsEmptyResult(resbody)) return new GetHouseRulesCategoriesResult();
		var res = JsonSerializer.Deserialize<GetHouseRulesCategoriesResult>(resbody)!;
		return res!;
	}

	public async Task<GetHomeResultServiceMind> GetHome(GetHomeQuery data)
	{
		var endpoint = _endpointprovider.GetHomeUrl();

		var client = await _endpointprovider.GetClientFromFactoryWithBearer(data.TenantId);
		client.DefaultRequestHeaders.Add("lang", data.Lang);
		var httpres = await client.GetAsync(endpoint);
		var resbody = await httpres.Content.ReadAsStringAsync();
		LoggerService.LogRequestAndResponse(_logger, httpres, resbody);
		ErrorChecking(httpres, resbody);
		if (IsEmptyResult(resbody)) return new GetHomeResultServiceMind();
		var res = JsonSerializer.Deserialize<GetHomeResultServiceMind>(resbody)!;
		return res!;
	}

	public async Task<List<GetDirectoryContactsResultServiceMind>> GetDirectoryContacts(GetDirectoryContactsQuery data)
	{
		var endpoint = _endpointprovider.GetDirectoryContactsUrl() + $"?page={data.Page}&limit={data.Limit}&name={data.Name}";

		var client = await _endpointprovider.GetClientFromFactoryWithBearer(data.TenantId);
		client.DefaultRequestHeaders.Add("lang", data.Lang);
		var httpres = await client.GetAsync(endpoint);
		var resbody = await httpres.Content.ReadAsStringAsync();
		LoggerService.LogRequestAndResponse(_logger, httpres, resbody);
		ErrorChecking(httpres, resbody);
		if (IsEmptyResult(resbody)) return new List<GetDirectoryContactsResultServiceMind>();
		var res = JsonSerializer.Deserialize<ServiceMindResidentialResponse<List<GetDirectoryContactsResultServiceMind>>>(resbody)!;
		return res.data!;
	}

	public async Task<GetPropertiesListResultServiceMind> GetPropertiesList(GetPropertiesListQuery data)
	{
		var endpoint = _endpointprovider.GetPropertiesUrl() + $"/list?building={data.Building}";

		var httpres = await (await _endpointprovider.GetClientFromFactoryWithBearer(data.TenantId)).GetAsync(endpoint);
		var resbody = await httpres.Content.ReadAsStringAsync();
		LoggerService.LogRequestAndResponse(_logger, httpres, resbody);
		ErrorChecking(httpres, resbody);
		if (IsEmptyResult(resbody)) return new GetPropertiesListResultServiceMind();
		var res = JsonSerializer.Deserialize<GetPropertiesListResultServiceMind>(resbody)!;
		return res!;
	}

	public async Task<GetPropertieDetailsResultServiceMind> GetPropertieDetails(GetPropertieDetailsQuery data)
	{
		var endpoint = _endpointprovider.GetPropertiesUrl() + $"/{data.PropertyUnitId}";

		var httpres = await (await _endpointprovider.GetClientFromFactoryWithBearer(data.TenantId)).GetAsync(endpoint);
		var resbody = await httpres.Content.ReadAsStringAsync();
		LoggerService.LogRequestAndResponse(_logger, httpres, resbody);
		ErrorChecking(httpres, resbody);
		if (IsEmptyResult(resbody)) return new GetPropertieDetailsResultServiceMind();
		var res = JsonSerializer.Deserialize<GetPropertieDetailsResultServiceMind>(resbody)!;
		return res!;
	}

	public async Task<GetProfileResultServiceMind> GetProfile(GetProfileQuery data)
	{
		var endpoint = _endpointprovider.GetProfileUrl();

		var httpres = await (await _endpointprovider.GetClientFromFactoryWithBearer(data.TenantId)).GetAsync(endpoint);
		var resbody = await httpres.Content.ReadAsStringAsync();
		LoggerService.LogRequestAndResponse(_logger, httpres, resbody);
		ErrorChecking(httpres, resbody);
		if (IsEmptyResult(resbody)) return new GetProfileResultServiceMind();
		var res = JsonSerializer.Deserialize<GetProfileResultServiceMind>(resbody)!;
		return res!;
	}

	public async Task<GetDefaultPropertyResult> GetDefaultProperty(GetDefaultPropertyQuery data)
	{
		var endpoint = _endpointprovider.GetDefaultPropertyUrl();

		var httpres = await (await _endpointprovider.GetClientFromFactoryWithBearer(data.TenantId)).GetAsync(endpoint);
		var resbody = await httpres.Content.ReadAsStringAsync();
		LoggerService.LogRequestAndResponse(_logger, httpres, resbody);
		ErrorChecking(httpres, resbody);
		if (IsEmptyResult(resbody)) return new GetDefaultPropertyResult();
		var res = JsonSerializer.Deserialize<GetDefaultPropertyResult>(resbody)!;
		return res!;
	}

	public async Task<UpdateDefaultPropertyResult> UpdateDefaultProperty(UpdateDefaultPropertyCommand data)
	{
		var endpoint = _endpointprovider.UpdateDefaultPropertyUrl();

		var httpres = await (await _endpointprovider.GetClientFromFactoryWithBearer(data.TenantId)).PostAsJsonAsync(endpoint, new
		{
			propertyUnitId = data.PropertyUnitId
		});
		var resbody = await httpres.Content.ReadAsStringAsync();
		LoggerService.LogRequestAndResponse(_logger, httpres, resbody);
		ErrorChecking(httpres, resbody);
		if (IsEmptyResult(resbody)) return new UpdateDefaultPropertyResult();
		var res = JsonSerializer.Deserialize<UpdateDefaultPropertyResult>(resbody)!;
		return res!;
	}

	public async Task<GetAnnouncementsResult> GetAnnouncements(GetAnnouncementsQuery data)
	{
		var endpoint = _endpointprovider.GetAnnouncementsUrl() + $"?page={data.Page}&limit={data.Limit}&projectIds={data.ProjectIds}";

		var client = await _endpointprovider.GetClientFromFactoryWithBearer(data.TenantId);
		client.DefaultRequestHeaders.Add("lang", data.Lang);
		var httpres = await client.GetAsync(endpoint);
		var resbody = await httpres.Content.ReadAsStringAsync();
		LoggerService.LogRequestAndResponse(_logger, httpres, resbody);
		ErrorChecking(httpres, resbody);
		if (IsEmptyResult(resbody)) return new GetAnnouncementsResult();
		var res = JsonSerializer.Deserialize<GetAnnouncementsResult>(resbody)!;
		return res!;
	}

	public async Task<GetAnnouncementDetailsResult> GetAnnouncementDetails(GetAnnouncementDetailsQuery data)
	{
		var endpoint = _endpointprovider.GetAnnouncementsUrl() + $"/{data.AnnouncementId}";

		var client = await _endpointprovider.GetClientFromFactoryWithBearer(data.TenantId);
		client.DefaultRequestHeaders.Add("lang", data.Lang);
		var httpres = await client.GetAsync(endpoint);
		var resbody = await httpres.Content.ReadAsStringAsync();
		LoggerService.LogRequestAndResponse(_logger, httpres, resbody);
		ErrorChecking(httpres, resbody);
		if (IsEmptyResult(resbody)) return new GetAnnouncementDetailsResult();
		var res = JsonSerializer.Deserialize<GetAnnouncementDetailsResult>(resbody)!;
		return res!;
	}

	public async Task<RegisterNewTenantResult> RegisterNewTenant(RegisterNewTenantCommand data)
	{
		var endpoint = _endpointprovider.RegisterNewTenantUrl();
		data.ClientSecret = _endpointprovider.GetClientSecret();
		var requestEmail = new RegisterNewTenantEmail();
		var requesPhone = new RegisterNewTenantPhone();
		if (data.Provider == "email")
		{
			requestEmail.Provider = data.Provider;
			requestEmail.TenantEmail = data.TenantEmail;
			requestEmail.ClientSecret = data.ClientSecret;
		}
		else if (data.Provider == "phone")
		{
			requesPhone.Provider = data.Provider;
			requesPhone.CountryCode = data.CountryCode;
			requesPhone.ClientSecret = data.ClientSecret;
			requesPhone.PhoneNumber = data.PhoneNumber;
		}

		var client = _endpointprovider.GetClientFromFactory();
		var httpres = data.Provider switch
		{
			"email" => await client.PostAsJsonAsync(endpoint, requestEmail),
			"phone" => await client.PostAsJsonAsync(endpoint, requesPhone),
			_ => throw new InvalidOperationException($"Unknown provider {data.Provider}"),
		};
		var resbody = await httpres.Content.ReadAsStringAsync();
		LoggerService.LogRequestAndResponse(_logger, httpres, resbody);
		ErrorChecking(httpres, resbody);
		if (IsEmptyResult(resbody)) return new RegisterNewTenantResult();
		var res = JsonSerializer.Deserialize<RegisterNewTenantResult>(resbody)!;
		return res!;
	}

	public async Task<GetRegisteredVehiclesResult> GetRegisteredVehicles(GetRegisteredVehiclesQuery data)
	{
		var endpoint = _endpointprovider.GetRegisteredVehiclesUrl();

		var httpres = await (await _endpointprovider.GetClientFromFactoryWithBearer(data.TenantId)).GetAsync(endpoint);
		var resbody = await httpres.Content.ReadAsStringAsync();
		LoggerService.LogRequestAndResponse(_logger, httpres, resbody);
		ErrorChecking(httpres, resbody);
		if (IsEmptyResult(resbody)) return new GetRegisteredVehiclesResult();
		var res = JsonSerializer.Deserialize<GetRegisteredVehiclesResult>(resbody)!;
		return res!;
	}

	public async Task<GetCarParkingQuotaUnitWiseResult> GetCarParkingQuotaUnitWise(GetCarParkingQuotaUnitWiseQuery data)
	{
		var endpoint = _endpointprovider.GetCarParkingQuotaUnitWiseUrl();

		var httpres = await (await _endpointprovider.GetClientFromFactoryWithBearer(data.TenantId)).GetAsync(endpoint);
		var resbody = await httpres.Content.ReadAsStringAsync();
		LoggerService.LogRequestAndResponse(_logger, httpres, resbody);
		ErrorChecking(httpres, resbody);
		if (IsEmptyResult(resbody)) return new GetCarParkingQuotaUnitWiseResult();
		var res = JsonSerializer.Deserialize<GetCarParkingQuotaUnitWiseResult>(resbody)!;
		return res!;
	}

	public async Task<GetCarParkingQuotaResult> GetCarParkingQuota(GetCarParkingQuotaQuery data)
	{
		var endpoint = _endpointprovider.GetCarParkingQuotaUrl();

		var httpres = await (await _endpointprovider.GetClientFromFactoryWithBearer(data.TenantId)).GetAsync(endpoint);
		var resbody = await httpres.Content.ReadAsStringAsync();
		LoggerService.LogRequestAndResponse(_logger, httpres, resbody);
		ErrorChecking(httpres, resbody);
		if (IsEmptyResult(resbody)) return new GetCarParkingQuotaResult();
		var res = JsonSerializer.Deserialize<GetCarParkingQuotaResult>(resbody)!;
		return res!;
	}

	public async Task<AddVisitorResult> AddVisitor(AddVisitorCommand data)
	{
		var endpoint = _endpointprovider.AddVisitorUrl();

		var httpres = await (await _endpointprovider.GetClientFromFactoryWithBearer(data.TenantId)).PostAsJsonAsync(endpoint, data);
		var resbody = await httpres.Content.ReadAsStringAsync();
		LoggerService.LogRequestAndResponse(_logger, httpres, resbody);
		ErrorChecking(httpres, resbody);
		if (IsEmptyResult(resbody)) return new AddVisitorResult();
		var res = JsonSerializer.Deserialize<AddVisitorResult>(resbody)!;
		return res!;
	}
	public async Task<UpdateVisitorStatusResult> UpdateVisitorStatus(UpdateVisitorStatusCommand data)
	{
		var endpoint = _endpointprovider.UpdateVisitorStatusUrl() + $"/{data.VisitorId}";

		var httpres = await (await _endpointprovider.GetClientFromFactoryWithBearer(data.TenantId)).PostAsJsonAsync(endpoint, new
		{
			data.isActive
		});
		var resbody = await httpres.Content.ReadAsStringAsync();
		LoggerService.LogRequestAndResponse(_logger, httpres, resbody);
		ErrorChecking(httpres, resbody);
		if (IsEmptyResult(resbody)) return new UpdateVisitorStatusResult();
		var res = JsonSerializer.Deserialize<UpdateVisitorStatusResult>(resbody)!;
		return res!;
	}
	public async Task<GetVisitorListResult> GetVisitorList(GetVisitorListQuery data)
	{
		var endpoint = _endpointprovider.GetVisitorListUrl() + $"?page={data.Page}&limit={data.Limit}&type={data.Type}&search={data.Search}&unitId={data.UnitId}";

		var httpres = await (await _endpointprovider.GetClientFromFactoryWithBearer(data.TenantId)).GetAsync(endpoint);
		var resbody = await httpres.Content.ReadAsStringAsync();
		LoggerService.LogRequestAndResponse(_logger, httpres, resbody);
		ErrorChecking(httpres, resbody);
		if (IsEmptyResult(resbody)) return new GetVisitorListResult();
		var res = JsonSerializer.Deserialize<GetVisitorListResult>(resbody)!;
		return res!;
	}
	public async Task<GetVisitorDetailsResult> GetVisitorDetails(GetVisitorDetailsQuery data)
	{
		var endpoint = _endpointprovider.GetVisitorDetailsUrl() + $"/{data.VisitorId}";

		var httpres = await (await _endpointprovider.GetClientFromFactoryWithBearer(data.TenantId)).GetAsync(endpoint);
		var resbody = await httpres.Content.ReadAsStringAsync();
		LoggerService.LogRequestAndResponse(_logger, httpres, resbody);
		ErrorChecking(httpres, resbody);
		if (IsEmptyResult(resbody)) return new GetVisitorDetailsResult();
		var res = JsonSerializer.Deserialize<GetVisitorDetailsResult>(resbody)!;
		return res!;
	}

	public async Task<GetParcelsResult> GetParcels(GetParcelsQuery data)
	{
		var endpoint = _endpointprovider.GetParcelsUrl() + $"?page={data.Page}&limit={data.Limit}&parcelStatus={data.ParcelStatus}&projectId={data.ProjectId}&unitId={data.UnitId}";

		var httpres = await (await _endpointprovider.GetClientFromFactoryWithBearer(data.TenantId)).GetAsync(endpoint);
		var resbody = await httpres.Content.ReadAsStringAsync();
		LoggerService.LogRequestAndResponse(_logger, httpres, resbody);
		ErrorChecking(httpres, resbody);
		if (IsEmptyResult(resbody)) return new GetParcelsResult();
		var res = JsonSerializer.Deserialize<GetParcelsResult>(resbody)!;
		return res!;
	}

	public async Task<GetParcelStatusListResult> GetParcelStatusList(GetParcelStatusListQuery data)
	{
		var endpoint = _endpointprovider.GetParcelStatusListUrl() + $"?projectId={data.ProjectId}&unitId={data.UnitId}";

		var httpres = await (await _endpointprovider.GetClientFromFactoryWithBearer(data.TenantId)).GetAsync(endpoint);
		var resbody = await httpres.Content.ReadAsStringAsync();
		LoggerService.LogRequestAndResponse(_logger, httpres, resbody);
		ErrorChecking(httpres, resbody);
		if (IsEmptyResult(resbody)) return new GetParcelStatusListResult();
		var res = JsonSerializer.Deserialize<GetParcelStatusListResult>(resbody)!;
		return res!;
	}

	public async Task<GetTenantDetailsParcelResult> GetTenantDetailsParcel(GetTenantDetailsParcelQuery data)
	{
		var endpoint = _endpointprovider.GetTenantDetailsParcelUrl() + $"/{data.ParcelId}";

		var httpres = await (await _endpointprovider.GetClientFromFactoryWithBearer(data.TenantId)).GetAsync(endpoint);
		var resbody = await httpres.Content.ReadAsStringAsync();
		LoggerService.LogRequestAndResponse(_logger, httpres, resbody);
		ErrorChecking(httpres, resbody);
		if (IsEmptyResult(resbody)) return new GetTenantDetailsParcelResult();
		var res = JsonSerializer.Deserialize<GetTenantDetailsParcelResult>(resbody)!;
		return res!;
	}

	public async Task<UpdateParcelReadStatusResult> UpdateParcelReadStatus(UpdateParcelReadStatusCommand data)
	{
		var endpoint = _endpointprovider.UpdateParcelReadStatusUrl();

		var httpres = await (await _endpointprovider.GetClientFromFactoryWithBearer(data.TenantId)).PatchAsJsonAsync(endpoint, new
		{
			data.ParcelId,
		});
		var resbody = await httpres.Content.ReadAsStringAsync();
		LoggerService.LogRequestAndResponse(_logger, httpres, resbody);
		ErrorChecking(httpres, resbody);
		if (IsEmptyResult(resbody)) return new UpdateParcelReadStatusResult();
		var res = JsonSerializer.Deserialize<UpdateParcelReadStatusResult>(resbody)!;
		return res!;
	}

	public async Task<GenerateNewPresignedResult> GenerateNewPresigned(GenerateNewPresignedCommand data)
	{
		var endpoint = _endpointprovider.GenerateNewPresignedUrl();

		var httpres = await (await _endpointprovider.GetClientFromFactoryWithBearer(data.TenantId)).PostAsJsonAsync(endpoint, data);
		var resbody = await httpres.Content.ReadAsStringAsync();
		LoggerService.LogRequestAndResponse(_logger, httpres, resbody);
		ErrorChecking(httpres, resbody);
		if (IsEmptyResult(resbody)) return new GenerateNewPresignedResult();
		var res = JsonSerializer.Deserialize<GenerateNewPresignedResult>(resbody)!;
		return res!;
	}

	public async Task<UploadImageUrlResult> UploadImageUrl(UploadImageUrlCommand data)
	{
		var endpoint = data.UploadURL;
		var client = _endpointprovider.GetClientFromFactory();
		client.DefaultRequestHeaders.Clear();
		var image = data.Image;
		string resbody = "";
		using (var ms = new MemoryStream())
		{
			await image.CopyToAsync(ms);
			var fileContent = new ByteArrayContent(ms.ToArray());
			fileContent.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue(image.ContentType);
			var httpres = await client.PutAsync(endpoint, fileContent);
			resbody = await httpres.Content.ReadAsStringAsync();
			LoggerService.LogRequestAndResponse(_logger, httpres, resbody);
			ErrorChecking(httpres, resbody);
		}

		return new UploadImageUrlResult();
	}

	public async Task<SaveLogsResult> SaveLogs(SaveLogsCommand data)
	{
		var endpoint = _endpointprovider.SaveLogsUrl();

		var httpres = await (await _endpointprovider.GetClientFromFactoryWithBearer(data.TenantId)).PostAsJsonAsync(endpoint, new
		{
			data.LogType,
			data.LogData,
		});
		var resbody = await httpres.Content.ReadAsStringAsync();
		LoggerService.LogRequestAndResponse(_logger, httpres, resbody);
		ErrorChecking(httpres, resbody);
		if (IsEmptyResult(resbody)) return new SaveLogsResult();
		var res = JsonSerializer.Deserialize<SaveLogsResult>(resbody)!;
		return res!;
	}

	public async Task<GetTermsAndConditionsResult> GetTermsAndConditions(GetTermsAndConditionsQuery data)
	{
		var endpoint = _endpointprovider.GetTermsAndConditionsUrl() + $"?projectId={data.ProjectId}";

		var client = await _endpointprovider.GetClientFromFactoryWithBearer(data.TenantId);
		client.DefaultRequestHeaders.Add("lang", data.Lang);
		var httpres = await client.GetAsync(endpoint);
		var resbody = await httpres.Content.ReadAsStringAsync();
		LoggerService.LogRequestAndResponse(_logger, httpres, resbody);
		if (IsEmptyResult(resbody)) return new GetTermsAndConditionsResult();
		var res = JsonSerializer.Deserialize<GetTermsAndConditionsResult>(resbody)!;
		return res!;
	}

	public async Task<AddVisitorCarParkingLogResult> AddVisitorCarParkingLog(AddVisitorCarParkingLogCommand data)
	{
		var endpoint = _endpointprovider.AddVisitorCarParkingLogUrl();

		var httpres = await _endpointprovider.GetClientFromFactory().PostAsJsonAsync(endpoint, data);
		var resbody = await httpres.Content.ReadAsStringAsync();
		LoggerService.LogRequestAndResponse(_logger, httpres, resbody);
		ErrorChecking(httpres, resbody);
		if (IsEmptyResult(resbody)) return new AddVisitorCarParkingLogResult();
		var res = JsonSerializer.Deserialize<AddVisitorCarParkingLogResult>(resbody)!;
		return res!;
	}

	public async Task<NotifyLiftArrivalResult> NotifyLiftArrival(NotifyLiftArrivalQuery data)
	{
		var endpoint = _endpointprovider.NotifyLiftArrivalUrl();

		var client = await _endpointprovider.GetClientFromFactoryWithBearer(data.TenantId);
		var httpres = await client.GetAsync(endpoint);
		var resbody = await httpres.Content.ReadAsStringAsync();
		LoggerService.LogRequestAndResponse(_logger, httpres, resbody);
		if (IsEmptyResult(resbody)) return new NotifyLiftArrivalResult();
		var res = JsonSerializer.Deserialize<NotifyLiftArrivalResult>(resbody)!;
		return res!;
	}
	public async Task<GetCommonAreasResult> GetCommonAreas(GetCommonAreasQuery data)
	{
		var endpoint = _endpointprovider.GetCommonAreasUrl() + $"?per_page={data.PerPage}&current_page={data.CurrentPage}";

		var client = await _endpointprovider.GetClientFromFactoryWithBearer(data.TenantId);
		var httpres = await client.GetAsync(endpoint);
		var resbody = await httpres.Content.ReadAsStringAsync();
		LoggerService.LogRequestAndResponse(_logger, httpres, resbody);
		ErrorChecking(httpres, resbody);
		if (IsEmptyResult(resbody)) return new GetCommonAreasResult();
		var res = JsonSerializer.Deserialize<GetCommonAreasResult>(resbody)!;
		return res!;
	}
	public async Task<GetEventTypesResult> GetEventTypes(GetEventTypesCommand data)
	{
		var endpoint = _endpointprovider.GetEventTypesUrl();

		var httpres = await (await _endpointprovider.GetClientFromFactoryWithBearer(data.TenantId)).PostAsJsonAsync(endpoint, new { data.Filter });
		var resbody = await httpres.Content.ReadAsStringAsync();
		LoggerService.LogRequestAndResponse(_logger, httpres, resbody);
		ErrorChecking(httpres, resbody);
		if (IsEmptyResult(resbody)) return new GetEventTypesResult();
		var res = JsonSerializer.Deserialize<GetEventTypesResult>(resbody)!;
		return res!;
	}
	public async Task<List<GetStatusCodesResult>> GetStatusCodes(GetStatusCodesQuery data)
	{
		var endpoint = _endpointprovider.GetStatusCodesUrl();

		var client = await _endpointprovider.GetClientFromFactoryWithBearer(data.TenantId);
		var httpres = await client.GetAsync(endpoint);
		var resbody = await httpres.Content.ReadAsStringAsync();
		LoggerService.LogRequestAndResponse(_logger, httpres, resbody);
		ErrorChecking(httpres, resbody);
		if (IsEmptyResult(resbody)) return new List<GetStatusCodesResult>();
		var res = JsonSerializer.Deserialize<List<GetStatusCodesResult>>(resbody)!;
		return res!;
	}
	public async Task<GetMaintainanceRepairListResult> GetMaintainanceRepairList(GetMaintainanceRepairListCommand data)
	{
		var endpoint = _endpointprovider.GetMaintainanceRepairListUrl() + $"?per_page={data.PerPage}&current_page={data.CurrentPage}"; ;

		var httpres = await (await _endpointprovider.GetClientFromFactoryWithBearer(data.TenantId)).PostAsJsonAsync(endpoint, new { data.Filter });
		var resbody = await httpres.Content.ReadAsStringAsync();
		LoggerService.LogRequestAndResponse(_logger, httpres, resbody);
		ErrorChecking(httpres, resbody);
		if (IsEmptyResult(resbody)) return new GetMaintainanceRepairListResult();
		var res = JsonSerializer.Deserialize<GetMaintainanceRepairListResult>(resbody)!;
		return res!;
	}

	public async Task<CreateMaintainanceRepairResult> CreateMaintainanceRepair(CreateMaintainanceRepairCommand data)
	{
		var endpoint = _endpointprovider.CreateMaintainanceRepairUrl();

		var httpres = await (await _endpointprovider.GetClientFromFactoryWithBearer(data.TenantId)).PostAsJsonAsync(endpoint, new
		{
			data.Description,
			data.EventTypeId,
			data.LocationType,
			data.PropertyUnitId,
			data.CommonAreaId,
			data.Image
		});
		var resbody = await httpres.Content.ReadAsStringAsync();
		LoggerService.LogRequestAndResponse(_logger, httpres, resbody);
		ErrorChecking(httpres, resbody);
		if (IsEmptyResult(resbody)) return new CreateMaintainanceRepairResult();
		var res = JsonSerializer.Deserialize<CreateMaintainanceRepairResult>(resbody)!;
		return res!;
	}

	public async Task<GetServiceRequestEventTypesResult> GetServiceRequestEventTypes(GetServiceRequestEventTypesCommand data)
	{
		var endpoint = _endpointprovider.GetServiceRequestEventTypesUrl();

		var httpres = await (await _endpointprovider.GetClientFromFactoryWithBearer(data.TenantId)).PostAsJsonAsync(endpoint, new { });
		var resbody = await httpres.Content.ReadAsStringAsync();
		LoggerService.LogRequestAndResponse(_logger, httpres, resbody);
		ErrorChecking(httpres, resbody);
		if (IsEmptyResult(resbody)) return new GetServiceRequestEventTypesResult();
		var res = JsonSerializer.Deserialize<GetServiceRequestEventTypesResult>(resbody)!;
		return res!;
	}
	public async Task<List<GetServiceRequestStatusCodesResult>> GetServiceRequestStatusCodes(GetServiceRequestStatusCodesQuery data)
	{
		var endpoint = _endpointprovider.GetServiceRequestStatusCodesUrl();

		var client = await _endpointprovider.GetClientFromFactoryWithBearer(data.TenantId);
		var httpres = await client.GetAsync(endpoint);
		var resbody = await httpres.Content.ReadAsStringAsync();
		LoggerService.LogRequestAndResponse(_logger, httpres, resbody);
		ErrorChecking(httpres, resbody);
		if (IsEmptyResult(resbody)) return new List<GetServiceRequestStatusCodesResult>();
		var res = JsonSerializer.Deserialize<List<GetServiceRequestStatusCodesResult>>(resbody)!;
		return res!;
	}
	public async Task<GetServiceRequestListResult> GetServiceRequestList(GetServiceRequestListCommand data)
	{
		var endpoint = _endpointprovider.GetServiceRequestListUrl() + $"?per_page={data.PerPage}&current_page={data.CurrentPage}"; ;

		var httpres = await (await _endpointprovider.GetClientFromFactoryWithBearer(data.TenantId)).PostAsJsonAsync(endpoint, new { data.Filter });
		var resbody = await httpres.Content.ReadAsStringAsync();
		LoggerService.LogRequestAndResponse(_logger, httpres, resbody);
		ErrorChecking(httpres, resbody);
		if (IsEmptyResult(resbody)) return new GetServiceRequestListResult();
		var res = JsonSerializer.Deserialize<GetServiceRequestListResult>(resbody)!;
		return res!;
	}

	public async Task<CreateServiceRequestResult> CreateServiceRequest(CreateServiceRequestCommand data)
	{
		var endpoint = _endpointprovider.CreateServiceRequestUrl();

		var httpres = await (await _endpointprovider.GetClientFromFactoryWithBearer(data.TenantId)).PostAsJsonAsync(endpoint, new
		{
			data.Description,
			data.ServiceRequestTypeId,
			data.PropertyUnitId,
			data.Image
		});
		var resbody = await httpres.Content.ReadAsStringAsync();
		LoggerService.LogRequestAndResponse(_logger, httpres, resbody);
		ErrorChecking(httpres, resbody);
		if (IsEmptyResult(resbody)) return new CreateServiceRequestResult();
		var res = JsonSerializer.Deserialize<CreateServiceRequestResult>(resbody)!;
		return res!;
	}

	public async Task<GetFeedbackEventTypesResult> GetFeedbackEventTypes(GetFeedbackEventTypesCommand data)
	{
		var endpoint = _endpointprovider.GetFeedbackEventTypesUrl();

		var httpres = await (await _endpointprovider.GetClientFromFactoryWithBearer(data.TenantId)).PostAsJsonAsync(endpoint, new { });
		var resbody = await httpres.Content.ReadAsStringAsync();
		LoggerService.LogRequestAndResponse(_logger, httpres, resbody);
		ErrorChecking(httpres, resbody);
		if (IsEmptyResult(resbody)) return new GetFeedbackEventTypesResult();
		var res = JsonSerializer.Deserialize<GetFeedbackEventTypesResult>(resbody)!;
		return res!;
	}
	public async Task<List<GetFeedbackStatusCodesResult>> GetFeedbackStatusCodes(GetFeedbackStatusCodesQuery data)
	{
		var endpoint = _endpointprovider.GetFeedbackStatusCodesUrl();

		var client = await _endpointprovider.GetClientFromFactoryWithBearer(data.TenantId);
		var httpres = await client.GetAsync(endpoint);
		var resbody = await httpres.Content.ReadAsStringAsync();
		LoggerService.LogRequestAndResponse(_logger, httpres, resbody);
		ErrorChecking(httpres, resbody);
		if (IsEmptyResult(resbody)) return new List<GetFeedbackStatusCodesResult>();
		var res = JsonSerializer.Deserialize<List<GetFeedbackStatusCodesResult>>(resbody)!;
		return res!;
	}
	public async Task<GetFeedbackListResult> GetFeedbackList(GetFeedbackListCommand data)
	{
		var endpoint = _endpointprovider.GetFeedbackListUrl() + $"?per_page={data.PerPage}&current_page={data.CurrentPage}"; ;

		var httpres = await (await _endpointprovider.GetClientFromFactoryWithBearer(data.TenantId)).PostAsJsonAsync(endpoint, new { data.Filter });
		var resbody = await httpres.Content.ReadAsStringAsync();
		LoggerService.LogRequestAndResponse(_logger, httpres, resbody);
		ErrorChecking(httpres, resbody);
		if (IsEmptyResult(resbody)) return new GetFeedbackListResult();
		var res = JsonSerializer.Deserialize<GetFeedbackListResult>(resbody)!;
		return res!;
	}

	public async Task<CreateFeedbackResult> CreateFeedback(CreateFeedbackCommand data)
	{
		var endpoint = _endpointprovider.CreateFeedbackUrl();

		var httpres = await (await _endpointprovider.GetClientFromFactoryWithBearer(data.TenantId)).PostAsJsonAsync(endpoint, new
		{
			data.Description,
			data.FeedbackTypeId,
			data.PropertyUnitId,
			data.Image
		});
		var resbody = await httpres.Content.ReadAsStringAsync();
		LoggerService.LogRequestAndResponse(_logger, httpres, resbody);
		ErrorChecking(httpres, resbody);
		if (IsEmptyResult(resbody)) return new CreateFeedbackResult();
		var res = JsonSerializer.Deserialize<CreateFeedbackResult>(resbody)!;
		return res!;
	}

	public async Task<CaseUpdatesResult> CaseUpdates(CaseUpdatesCommand data)
	{
		var endpoint = _endpointprovider.CaseUpdatesUrl();

		var httpres = await _endpointprovider.GetClientFromFactory().PostAsJsonAsync(endpoint, new
		{
			ClientSecret = _endpointprovider.GetClientSecret(),
			data.Updates
		});
		var resbody = await httpres.Content.ReadAsStringAsync();
		LoggerService.LogRequestAndResponse(_logger, httpres, resbody);
		ErrorChecking(httpres, resbody);
		if (IsEmptyResult(resbody)) return new CaseUpdatesResult();
		var res = JsonSerializer.Deserialize<CaseUpdatesResult>(resbody)!;
		return res!;
	}

	public async Task<DeactivateVisitorPassResult> DeactivateVisitorPass(DeactivateVisitorPassCommand data)
	{
		var endpoint = _endpointprovider.DeactivateVisitorPassUrl();

		var httpres = await _endpointprovider.GetClientFromFactory().PostAsJsonAsync(endpoint, data);
		var resbody = await httpres.Content.ReadAsStringAsync();
		LoggerService.LogRequestAndResponse(_logger, httpres, resbody);
		ErrorChecking(httpres, resbody);
		var requestThirdParty = httpres.RequestMessage?.Content == null ? "" : httpres.RequestMessage.Content.ReadAsStringAsync().Result;
		var requestThirdPartyJson = $"request:{requestThirdParty}, response:{resbody}";
		if (resbody.Contains("ไม่พบข้อมูล")) throw ServiceMindResidentialServiceException.SMS007(requestThirdPartyJson);
		var res = JsonSerializer.Deserialize<DeactivateVisitorPassResult>(resbody)!;
		return res!;
	}

	public async Task<GetQuestionnairesResult> GetQuestionnaires(GetQuestionnairesQuery data)
	{
		var endpoint = _endpointprovider.GetQuestionnairesUrl() + $"?page={data.Page}&limit={data.Limit}&projectId={data.ProjectId}";

		var client = await _endpointprovider.GetClientFromFactoryWithBearer(data.TenantId);
		client.DefaultRequestHeaders.Add("lang", data.Lang);
		var httpres = await client.GetAsync(endpoint);
		var resbody = await httpres.Content.ReadAsStringAsync();
		LoggerService.LogRequestAndResponse(_logger, httpres, resbody);
		ErrorChecking(httpres, resbody);
		if (IsEmptyResult(resbody)) return new GetQuestionnairesResult();
		var res = JsonSerializer.Deserialize<GetQuestionnairesResult>(resbody)!;
		return res!;
	}

	public async Task<GetQuestionnaireDetailResult> GetQuestionnaireDetails(GetQuestionnaireDetailQuery data)
	{
		var endpoint = _endpointprovider.GetQuestionnaireDetailsUrl() + $"/{data.QuestionnaireId}";

		var client = await _endpointprovider.GetClientFromFactoryWithBearer(data.TenantId);
		client.DefaultRequestHeaders.Add("lang", data.Lang);
		var httpres = await client.GetAsync(endpoint);
		var resbody = await httpres.Content.ReadAsStringAsync();
		LoggerService.LogRequestAndResponse(_logger, httpres, resbody);
		ErrorChecking(httpres, resbody);
		if (IsEmptyResult(resbody)) return new GetQuestionnaireDetailResult();
		var res = JsonSerializer.Deserialize<GetQuestionnaireDetailResult>(resbody)!;
		return res!;
	}

	public async Task<GetQuestionnaireHistoryResult> GetQuestionnaireHistory(GetQuestionnaireHistoryQuery data)
	{
		var endpoint = _endpointprovider.GetQuestionnaireHistoryUrl() + $"?page={data.Page}&limit={data.Limit}&projectId={data.ProjectId}";

		var client = await _endpointprovider.GetClientFromFactoryWithBearer(data.TenantId);
		client.DefaultRequestHeaders.Add("lang", data.Lang);
		var httpres = await client.GetAsync(endpoint);
		var resbody = await httpres.Content.ReadAsStringAsync();
		LoggerService.LogRequestAndResponse(_logger, httpres, resbody);
		ErrorChecking(httpres, resbody);
		if (IsEmptyResult(resbody)) return new GetQuestionnaireHistoryResult();
		var res = JsonSerializer.Deserialize<GetQuestionnaireHistoryResult>(resbody)!;
		return res!;
	}

	public async Task<SubmitQuestionnaireResult> SubmitQuestionnaire(SubmitQuestionnaireCommand data)
	{
		var endpoint = _endpointprovider.SubmitQuestionnaireUrl() + $"/{data.QuestionnaireId}";

		var httpres = await (await _endpointprovider.GetClientFromFactoryWithBearer(data.TenantId)).PostAsJsonAsync(endpoint, new
		{
			data.Sections
		});
		var resbody = await httpres.Content.ReadAsStringAsync();
		LoggerService.LogRequestAndResponse(_logger, httpres, resbody);
		ErrorChecking(httpres, resbody);
		if (IsEmptyResult(resbody)) return new SubmitQuestionnaireResult();
		var res = JsonSerializer.Deserialize<SubmitQuestionnaireResult>(resbody)!;
		return res!;
	}

	public async Task<OnboardingSyncUpdatesResult> OnboardingSyncUpdates(OnboardingSyncUpdatesCommand data)
	{
		var endpoint = _endpointprovider.OnboardingSyncUpdatesUrl();

		var httpres = await _endpointprovider.GetClientFromFactory().PostAsJsonAsync(endpoint, new
		{
			ClientSecret = _endpointprovider.GetClientSecret(),
			data.Updates
		});
		var resbody = await httpres.Content.ReadAsStringAsync();
		LoggerService.LogRequestAndResponse(_logger, httpres, resbody);
		ErrorChecking(httpres, resbody);
		if (IsEmptyResult(resbody)) return new OnboardingSyncUpdatesResult();
		var res = JsonSerializer.Deserialize<OnboardingSyncUpdatesResult>(resbody)!;
		return res!;
	}

	public async Task<GeneratePromptPayQrResult> GeneratePromptPayQr(GeneratePromptPayQrCommand data)
	{
		var endpoint = _endpointprovider.GeneratePromptPayQrUrl();

		var httpres = await (await _endpointprovider.GetClientFromFactoryWithBearer(data.TenantId)).PostAsJsonAsync(endpoint, new
		{
			data.InvoiceType,
			data.InvoiceNo,
			data.Description,
			data.Amount,
			data.SubCode,
			//data.Cache
		});
		var resbody = await httpres.Content.ReadAsStringAsync();
		LoggerService.LogRequestAndResponse(_logger, httpres, resbody);
		ErrorChecking(httpres, resbody);
		if (IsEmptyResult(resbody)) return new GeneratePromptPayQrResult();
		var res = JsonSerializer.Deserialize<GeneratePromptPayQrResult>(resbody)!;
		return res!;
	}

	public async Task<GetCallBackPaymentResult> GetCallBackPayment(GetCallBackPaymentCommand data)
	{
		var endpoint = _endpointprovider.GetCallBackPaymentUrl();

		var httpres = await _endpointprovider.GetClientFromFactory().PostAsJsonAsync(endpoint, new
		{
			ClientSecret = _endpointprovider.GetClientSecret(),
			data.PaymentPayload
		});
		var resbody = await httpres.Content.ReadAsStringAsync();
		LoggerService.LogRequestAndResponse(_logger, httpres, resbody);
		ErrorChecking(httpres, resbody);
		if (IsEmptyResult(resbody)) return new GetCallBackPaymentResult();
		var res = JsonSerializer.Deserialize<GetCallBackPaymentResult>(resbody)!;
		return res!;
	}

	public async Task<GetPaymentTransactionResult> GetPaymentTransaction(GetPaymentTransactionCommand data)
	{
		var endpoint = _endpointprovider.GetPaymentTransactionUrl();

		var httpres = await (await _endpointprovider.GetClientFromFactoryWithBearer(data.TenantId)).PostAsJsonAsync(endpoint, new
		{
			data.InvoiceNo
		});
		var resbody = await httpres.Content.ReadAsStringAsync();
		LoggerService.LogRequestAndResponse(_logger, httpres, resbody);
		ErrorChecking(httpres, resbody);
		if (IsEmptyResult(resbody)) return new GetPaymentTransactionResult();
		var res = JsonSerializer.Deserialize<GetPaymentTransactionResult>(resbody)!;
		return res!;
	}

	public async Task<GetPaymentInquiryResult> GetPaymentInquiry(GetPaymentInquiryCommand data)
	{
		var endpoint = _endpointprovider.GetPaymentInquiryUrl();
		var httpres = await (await _endpointprovider.GetClientFromFactoryWithBearer(data.TenantId)).PostAsJsonAsync(endpoint, new
		{
			data.TransactionNo,
			data.SubCode,
		});
		var resbody = await httpres.Content.ReadAsStringAsync();
		LoggerService.LogRequestAndResponse(_logger, httpres, resbody);
		ErrorChecking(httpres, resbody);
		if (IsEmptyResult(resbody)) return new GetPaymentInquiryResult();
		var res = JsonSerializer.Deserialize<GetPaymentInquiryResult>(resbody)!;
		return res!;
	}

	public async Task<GetLatestMeterReadingResult> GetLatestMeterReading(GetLatestMeterReadingCommand data)
	{
		var endpoint = _endpointprovider.GetLatestMeterReadingUrl() + $"?per_page={data.PerPage}&current_page={data.CurrentPage}";
		var httpres = await (await _endpointprovider.GetClientFromFactoryWithBearer(data.TenantId)).PostAsJsonAsync(endpoint, new
		{
			data.Filter,
		});
		var resbody = await httpres.Content.ReadAsStringAsync();
		LoggerService.LogRequestAndResponse(_logger, httpres, resbody);
		ErrorChecking(httpres, resbody);
		if (IsEmptyResult(resbody)) return new GetLatestMeterReadingResult();
		var res = JsonSerializer.Deserialize<GetLatestMeterReadingResult>(resbody)!;
		return res!;
	}
	public async Task<GetBillingHistoryResult> GetBillingHistory(GetBillingHistoryCommand data)
	{
		var endpoint = _endpointprovider.GetBillingHistoryUrl();

		var httpres = await (await _endpointprovider.GetClientFromFactoryWithBearer(data.TenantId)).PostAsJsonAsync(endpoint, new
		{
			data.Filter,
			data.CompareLastYear
		});
		var resbody = await httpres.Content.ReadAsStringAsync();
		LoggerService.LogRequestAndResponse(_logger, httpres, resbody);
		ErrorChecking(httpres, resbody);
		if (IsEmptyResult(resbody)) return new GetBillingHistoryResult();
		var res = JsonSerializer.Deserialize<GetBillingHistoryResult>(resbody)!;
		return res!;
	}
	public async Task<GetInvoiceHistoryResult> GetInvoiceHistory(GetInvoiceHistoryCommand data)
	{
		var endpoint = _endpointprovider.GetInvoiceHistoryUrl() + $"?per_page={data.PerPage}&current_page={data.CurrentPage}";
		var httpres = await (await _endpointprovider.GetClientFromFactoryWithBearer(data.TenantId)).PostAsJsonAsync(endpoint, new
		{
			data.Filter,
		});
		var resbody = await httpres.Content.ReadAsStringAsync();
		LoggerService.LogRequestAndResponse(_logger, httpres, resbody);
		ErrorChecking(httpres, resbody);
		if (IsEmptyResult(resbody)) return new GetInvoiceHistoryResult();
		var res = JsonSerializer.Deserialize<GetInvoiceHistoryResult>(resbody)!;
		return res!;
	}
	public async Task<GetInvoiceDetailsResult> GetInvoiceDetails(GetInvoiceDetailsQuery data)
	{
		var endpoint = _endpointprovider.GetInvoiceDetailsUrl() + $"?invoiceId={Uri.EscapeDataString(data.InvoiceId)}";
		var httpres = await (await _endpointprovider.GetClientFromFactoryWithBearer(data.TenantId)).GetAsync(endpoint);
		var resbody = await httpres.Content.ReadAsStringAsync();
		LoggerService.LogRequestAndResponse(_logger, httpres, resbody);
		ErrorChecking(httpres, resbody);
		if (IsEmptyResult(resbody)) return new GetInvoiceDetailsResult();
		var res = JsonSerializer.Deserialize<GetInvoiceDetailsResult>(resbody)!;
		return res!;
	}
	public async Task<GetReceiptDetailsResult> GetReceiptDetails(GetReceiptDetailsQuery data)
	{
		var endpoint = _endpointprovider.GetReceiptDetailsUrl() + $"?receiptId={Uri.EscapeDataString(data.ReceiptId)}";
		var httpres = await (await _endpointprovider.GetClientFromFactoryWithBearer(data.TenantId)).GetAsync(endpoint);
		var resbody = await httpres.Content.ReadAsStringAsync();
		LoggerService.LogRequestAndResponse(_logger, httpres, resbody);
		ErrorChecking(httpres, resbody);
		if (IsEmptyResult(resbody)) return new GetReceiptDetailsResult();
		var res = JsonSerializer.Deserialize<GetReceiptDetailsResult>(resbody)!;
		return res!;
	}
}