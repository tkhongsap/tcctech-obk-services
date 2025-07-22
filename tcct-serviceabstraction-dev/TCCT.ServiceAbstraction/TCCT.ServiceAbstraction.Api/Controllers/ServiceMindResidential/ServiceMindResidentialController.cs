using MediatR;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using System.Net;
using TCCT.ServiceAbstraction.Application.Features;
using TCCT.ServiceAbstraction.Application.Features.FinedayResidence.Residence.GetDetailResidenceMemberByPersonID;
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

namespace TCCT.ServiceAbstraction.Api.Controllers.ServiceMindResidential;

[Route("api/v1/resident")]
[ApiController]
[ApiExplorerSettings(GroupName = "residentialv1")]
public class ServiceMindResidentialController : ControllerBase
{
	private readonly IMediator _mediator;
	public ServiceMindResidentialController(IMediator mediator)
	{
		_mediator = mediator;
	}

	[HttpGet("tenant/{tenantId}")]
	[SwaggerOperation(Summary = "Persona")]
	[ProducesResponseType(typeof(GetProfileResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetCaseTaskByCaseId(string tenantId)
	{
		var query = new GetProfileQuery(tenantId);
		var res = await _mediator.Send(query);
		return Ok(res);
	}

	[HttpGet("tenant/{tenantId}/properties")]
	[SwaggerOperation(Summary = "Tenant Properties")]
	[ProducesResponseType(typeof(GetPropertiesListResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetPropertiesList(string tenantId, [FromQuery(Name = "building")] string? building)
	{
		var query = new GetPropertiesListQuery(tenantId, building);
		var res = await _mediator.Send(query);
		return Ok(res);
	}

	[HttpGet("tenant/{tenantId}/properties/{id}")]
	[SwaggerOperation(Summary = "Tenant Propertie Details")]
	[ProducesResponseType(typeof(GetPropertieDetailsResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetPropertieDetails(string tenantId, string id)
	{
		var query = new GetPropertieDetailsQuery(tenantId, id);
		var res = await _mediator.Send(query);
		return Ok(res);
	}

	[HttpGet("announcements")]
	[SwaggerOperation(Summary = "Announcements")]
	[ProducesResponseType(typeof(GetAnnouncementsResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetAnnouncements([FromQuery(Name = "page")] int? page, [FromQuery(Name = "limit")] int? limit, [FromQuery(Name = "projectIds")] string? projectIds, [FromHeader(Name = "lang")] string? lang, [FromQuery(Name = "tenantId")] string? tenantId)
	{
		var query = new GetAnnouncementsQuery(tenantId, page, limit, projectIds, lang);
		var res = await _mediator.Send(query);
		return Ok(res);
	}

	[HttpGet("announcements/{id}")]
	[SwaggerOperation(Summary = "Announcement Details")]
	[ProducesResponseType(typeof(GetAnnouncementDetailsResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetAnnouncementDetails(string id, [FromHeader(Name = "lang")] string? lang, [FromQuery(Name = "tenantId")] string? tenantId)
	{
		var query = new GetAnnouncementDetailsQuery(tenantId, id, lang);
		var res = await _mediator.Send(query);
		return Ok(res);
	}

	[HttpGet("home")]
	[SwaggerOperation(Summary = "Home")]
	[ProducesResponseType(typeof(GetHomeResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetHome([FromQuery(Name = "tenantId")] string? tenantId, [FromQuery(Name = "projectId")] int? projectId, [FromHeader(Name = "lang")] string? lang)
	{
		var query = new GetHomeQuery(tenantId, projectId, lang);
		var res = await _mediator.Send(query);
		return Ok(res);
	}

	[HttpGet("directory-contacts")]
	[SwaggerOperation(Summary = "Directory Contacts")]
	[ProducesResponseType(typeof(GetDirectoryContactsResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetDirectoryContacts([FromQuery(Name = "page")] int? page, [FromQuery(Name = "limit")] int? limit, [FromQuery(Name = "name")] string? name, [FromHeader(Name = "lang")] string? lang, [FromQuery(Name = "tenantId")] string? tenantId)
	{
		var query = new GetDirectoryContactsQuery(tenantId, page, limit, name, lang);
		var res = await _mediator.Send(query);
		return Ok(res);
	}

	[HttpGet("house-rules/categories")]
	[SwaggerOperation(Summary = "House Rules Categories")]
	[ProducesResponseType(typeof(GetHouseRulesCategoriesResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetHouseRulesCategories([FromQuery(Name = "page")] int? page, [FromQuery(Name = "limit")] int? limit, [FromQuery(Name = "name")] string? name, [FromHeader(Name = "lang")] string? lang, [FromQuery(Name = "projectId")] string? projectId, [FromQuery(Name = "tenantId")] string? tenantId)
	{
		var query = new GetHouseRulesCategoriesQuery(tenantId, page, limit, name, lang, projectId);
		var res = await _mediator.Send(query);
		return Ok(res);
	}

	[HttpGet("house-rules")]
	[SwaggerOperation(Summary = "House Rules")]
	[ProducesResponseType(typeof(GetHouseRulesResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetHouseRules([FromQuery(Name = "page")] int? page, [FromQuery(Name = "limit")] int? limit, [FromQuery(Name = "name")] string? name, [FromHeader(Name = "lang")] string? lang, [FromQuery(Name = "categoryId")] string? categoryId, [FromQuery(Name = "tenantId")] string? tenantId)
	{
		var query = new GetHouseRulesQuery(tenantId, page, limit, name, lang, categoryId);
		var res = await _mediator.Send(query);
		return Ok(res);
	}

	[HttpGet("default-property")]
	[SwaggerOperation(Summary = "Default Property")]
	[ProducesResponseType(typeof(GetDefaultPropertyResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetDefaultProperty([FromQuery(Name = "tenantId")] string tenantId)
	{
		var query = new GetDefaultPropertyQuery(tenantId);
		var res = await _mediator.Send(query);
		return Ok(res);
	}

	[HttpGet("tenant/{tenantId}/car-parking/get-registered-vehicles")]
	[SwaggerOperation(Summary = "Get Registered Vehicles")]
	[ProducesResponseType(typeof(GetRegisteredVehiclesResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetRegisteredVehicles(string tenantId)
	{
		var query = new GetRegisteredVehiclesQuery(tenantId);
		var res = await _mediator.Send(query);
		return Ok(res);
	}

	[HttpGet("tenant/{tenantId}/car-parking/get-car-parking-quota-unit-wise")]
	[SwaggerOperation(Summary = "Get Car Parking Quota Unit Wise")]
	[ProducesResponseType(typeof(GetCarParkingQuotaUnitWiseResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetCarParkingQuotaUnitWise(string tenantId)
	{
		var query = new GetCarParkingQuotaUnitWiseQuery(tenantId);
		var res = await _mediator.Send(query);
		return Ok(res);
	}

	[HttpGet("tenant/{tenantId}/car-parking/get-car-parking-quota-total-combined")]
	[SwaggerOperation(Summary = "Get Car Parking Quota - Total Combined")]
	[ProducesResponseType(typeof(GetCarParkingQuotaResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetCarParkingQuota(string tenantId)
	{
		var query = new GetCarParkingQuotaQuery(tenantId);
		var res = await _mediator.Send(query);
		return Ok(res);
	}

	[HttpPost("register-new-tenant")]
	[SwaggerOperation(Summary = "Register New Tenant")]
	[ProducesResponseType(typeof(RegisterNewTenantResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> RegisterNewTenant([FromBody] RegisterNewTenantCommand body)
	{
		var res = await _mediator.Send(body);
		return Ok(res);
	}

	[HttpPost("update-default-property")]
	[SwaggerOperation(Summary = "Update Default Property")]
	[ProducesResponseType(typeof(UpdateDefaultPropertyResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> UpdateDefaultProperty([FromBody] UpdateDefaultPropertyCommand body)
	{
		var res = await _mediator.Send(body);
		return Ok(res);
	}

	[HttpGet("tenant/{tenantId}/visitors")]
	[SwaggerOperation(Summary = "Tenant Visitors")]
	[ProducesResponseType(typeof(GetVisitorListResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetVisitorList(string tenantId, [FromQuery(Name = "page")] int? page, [FromQuery(Name = "limit")] int? limit, [FromQuery(Name = "type")] int? type, [FromQuery(Name = "search")] string? search, [FromQuery(Name = "unitId")] string? unitId)
	{
		var query = new GetVisitorListQuery(tenantId, page, limit, type, search, unitId);
		var res = await _mediator.Send(query);
		return Ok(res);
	}

	[HttpGet("tenant/{tenantId}/visitor/{id}")]
	[SwaggerOperation(Summary = "Tenant Visitor Details")]
	[ProducesResponseType(typeof(GetVisitorDetailsResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetVisitorDetails(string tenantId, string id)
	{
		var query = new GetVisitorDetailsQuery(tenantId, id);
		var res = await _mediator.Send(query);
		return Ok(res);
	}

	[HttpPost("tenant/add-visitor")]
	[SwaggerOperation(Summary = "Add Visitor")]
	[ProducesResponseType(typeof(AddVisitorResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> AddVisitor([FromBody] AddVisitorCommand body)
	{
		var res = await _mediator.Send(body);
		return Ok(res);
	}

	[HttpPost("tenant/visitor/update-status")]
	[SwaggerOperation(Summary = "Activate / Deactivate Visitor Pass")]
	[ProducesResponseType(typeof(UpdateVisitorStatusResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> UpdateVisitorStatus([FromBody] UpdateVisitorStatusCommand body)
	{
		var res = await _mediator.Send(body);
		return Ok(res);
	}

	[HttpGet("tenant/{tenantId}/parcels")]
	[SwaggerOperation(Summary = "Get Tenant's Parcel")]
	[ProducesResponseType(typeof(GetParcelsResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetParcels(string tenantId, [FromQuery(Name = "page")] int? page, [FromQuery(Name = "limit")] int? limit, [FromQuery(Name = "projectId")] string? projectId, [FromQuery(Name = "parcelStatus")] string? parcelStatus, [FromQuery(Name = "unitId")] string? unitId)
	{
		var query = new GetParcelsQuery(tenantId, page, limit, projectId, parcelStatus, unitId);
		var res = await _mediator.Send(query);
		return Ok(res);
	}

	[HttpGet("get-parcel-status-list")]
	[SwaggerOperation(Summary = "Get Parcel Status List")]
	[ProducesResponseType(typeof(GetParcelStatusListResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetParcelStatusList(string tenantId, [FromQuery(Name = "projectId")] string? projectId, [FromQuery(Name = "unitId")] string? unitId)
	{
		var query = new GetParcelStatusListQuery(tenantId, projectId, unitId);
		var res = await _mediator.Send(query);
		return Ok(res);
	}

	[HttpGet("tenant/{tenantId}/parcel/{id}")]
	[SwaggerOperation(Summary = "Get Tenant's Parcel Details")]
	[ProducesResponseType(typeof(GetTenantDetailsParcelResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetTenantDetailsParcel(string tenantId, string id)
	{
		var query = new GetTenantDetailsParcelQuery(tenantId, id);
		var res = await _mediator.Send(query);
		return Ok(res);
	}

	[HttpPatch("update-parcel-read-status")]
	[SwaggerOperation(Summary = "Update Parcel Read Status")]
	[ProducesResponseType(typeof(UpdateParcelReadStatusResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> UpdateParcelReadStatus([FromBody] UpdateParcelReadStatusCommand body)
	{
		var res = await _mediator.Send(body);
		return Ok(res);
	}

	[HttpPost("authorize-tenant")]
	[SwaggerOperation(Summary = "Oauth Token")]
	[ProducesResponseType(typeof(AuthorizeTenantResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> AuthorizeTenant([FromBody] AuthorizeTenantCommand body)
	{
		var res = await _mediator.Send(body);
		return Ok(res);
	}

	[HttpPost("generate-new-presigned-url")]
	[SwaggerOperation(Summary = "Generate New Presigned URL")]
	[ProducesResponseType(typeof(GenerateNewPresignedResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	public async Task<IActionResult> GenerateNewPresigned([FromBody] GenerateNewPresignedCommand body)
	{
		var res = await _mediator.Send(body);
		return Ok(res);
	}

	[HttpPost("upload-image-url")]
	[SwaggerOperation(Summary = "Upload Image URL")]
	[ProducesResponseType(typeof(UploadImageUrlResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	public async Task<IActionResult> UploadImageUrl([FromForm] UploadImageUrlCommand body)
	{
		var res = await _mediator.Send(body);
		return Ok(res);
	}

	[HttpPost("save-logs")]
	[SwaggerOperation(Summary = "Save Logs")]
	[ProducesResponseType(typeof(SaveLogsResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	public async Task<IActionResult> SaveLogs([FromBody] SaveLogsCommand body)
	{
		var res = await _mediator.Send(body);
		return Ok(res);
	}

	[HttpGet("tenant/{tenantId}/car-parking/{projectId}/terms-and-conditions")]
	[SwaggerOperation(Summary = "Terms and Conditions")]
	[ProducesResponseType(typeof(GetTermsAndConditionsResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetTermsAndConditions([FromHeader(Name = "lang")] string? lang, string projectId, string tenantId)
	{
		var query = new GetTermsAndConditionsQuery(tenantId, lang, projectId);
		var res = await _mediator.Send(query);
		return Ok(res);
	}

	[HttpGet("terms-and-conditions/tenant/{tenantId}/car-parking/{projectId}")]
	[SwaggerOperation(Summary = "Terms and Conditions")]
	[ProducesResponseType(typeof(GetTermsAndConditionsResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetTermsAndConditionsEmail([FromHeader(Name = "lang")] string? lang, string projectId, string tenantId)
	{
		var query = new GetTermsAndConditionsQuery(tenantId, lang, projectId);
		var res = await _mediator.Send(query);
		return Ok(res);
	}

	[HttpPost("add-visitor-car-parking-log")]
	[SwaggerOperation(Summary = "Add Visitor Car Parking Log")]
	[ProducesResponseType(typeof(AddVisitorCarParkingLogResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> AddVisitorCarParkingLog([FromBody] AddVisitorCarParkingLogCommand request)
	{
		var res = await _mediator.Send(request);
		return Ok(res);
	}

	[HttpGet("notifications/notify-lift-arrival/{tenantId}")]
	[SwaggerOperation(Summary = "Notify Lift Arrival")]
	[ProducesResponseType(typeof(NotifyLiftArrivalResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> NotifyLiftArrival(string tenantId)
	{
		var query = new NotifyLiftArrivalQuery(tenantId);
		var res = await _mediator.Send(query);
		return Ok(res);
	}

	[HttpPost("maintenance-repair/get-event-types")]
	[SwaggerOperation(Summary = "Get event types")]
	[ProducesResponseType(typeof(GetEventTypesResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetEventTypes([FromBody] GetEventTypesCommand request)
	{
		var res = await _mediator.Send(request);
		return Ok(res);
	}

	[HttpPost("maintenance-repair/get-maintainance-repair-list")]
	[SwaggerOperation(Summary = "Get maintainance repair list")]
	[ProducesResponseType(typeof(GetMaintainanceRepairListResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetMaintainanceRepairList([FromBody] GetMaintainanceRepairListCommand request)
	{
		var res = await _mediator.Send(request);
		return Ok(res);
	}

	[HttpGet("get-common-areas")]
	[SwaggerOperation(Summary = "Get common areas")]
	[ProducesResponseType(typeof(GetCommonAreasResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetCommonAreas([FromQuery(Name = "tenantId")] string tenantId, [FromQuery(Name = "perPage")] int? perPage = 200, [FromQuery(Name = "currentPage")] int? currentPage = 1)
	{
		var query = new GetCommonAreasQuery(tenantId, perPage, currentPage);
		var res = await _mediator.Send(query);
		return Ok(res);
	}

	[HttpGet("maintenance-repair/get-status-codes")]
	[SwaggerOperation(Summary = "Get status codes")]
	[ProducesResponseType(typeof(List<GetStatusCodesResult>), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetStatusCodes([FromQuery(Name = "tenantId")] string tenantId)
	{
		var query = new GetStatusCodesQuery(tenantId);
		var res = await _mediator.Send(query);
		return Ok(res);
	}

	[HttpPost("maintenance-repair/create-case")]
	[SwaggerOperation(Summary = "Create case")]
	[ProducesResponseType(typeof(CreateMaintainanceRepairResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> CreateMaintainanceRepair([FromBody] CreateMaintainanceRepairCommand request)
	{
		var res = await _mediator.Send(request);
		return Ok(res);
	}

	[HttpPost("service-request/get-event-types")]
	[SwaggerOperation(Summary = "Get event types")]
	[ProducesResponseType(typeof(GetServiceRequestEventTypesResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetServiceRequestEventTypes([FromBody] GetServiceRequestEventTypesCommand request)
	{
		var res = await _mediator.Send(request);
		return Ok(res);
	}

	[HttpPost("service-request/get-list")]
	[SwaggerOperation(Summary = "Get service request list")]
	[ProducesResponseType(typeof(GetServiceRequestListResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetServiceRequestList([FromBody] GetServiceRequestListCommand request)
	{
		var res = await _mediator.Send(request);
		return Ok(res);
	}

	[HttpGet("service-request/get-status-codes")]
	[SwaggerOperation(Summary = "Get status codes")]
	[ProducesResponseType(typeof(List<GetServiceRequestStatusCodesResult>), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetServiceRequestStatusCodes([FromQuery(Name = "tenantId")] string tenantId)
	{
		var query = new GetServiceRequestStatusCodesQuery(tenantId);
		var res = await _mediator.Send(query);
		return Ok(res);
	}

	[HttpPost("service-request/create-case")]
	[SwaggerOperation(Summary = "Create case")]
	[ProducesResponseType(typeof(CreateServiceRequestResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> CreateServiceRequest([FromBody] CreateServiceRequestCommand request)
	{
		var res = await _mediator.Send(request);
		return Ok(res);
	}

	[HttpPost("feedback/get-event-types")]
	[SwaggerOperation(Summary = "Get event types")]
	[ProducesResponseType(typeof(GetFeedbackEventTypesResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetFeedbackEventTypes([FromBody] GetFeedbackEventTypesCommand request)
	{
		var res = await _mediator.Send(request);
		return Ok(res);
	}

	[HttpPost("feedback/get-list")]
	[SwaggerOperation(Summary = "Get service request list")]
	[ProducesResponseType(typeof(GetFeedbackListResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetFeedbackList([FromBody] GetFeedbackListCommand request)
	{
		var res = await _mediator.Send(request);
		return Ok(res);
	}

	[HttpGet("feedback/get-status-codes")]
	[SwaggerOperation(Summary = "Get status codes")]
	[ProducesResponseType(typeof(List<GetFeedbackStatusCodesResult>), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetFeedbackStatusCodes([FromQuery(Name = "tenantId")] string tenantId)
	{
		var query = new GetFeedbackStatusCodesQuery(tenantId);
		var res = await _mediator.Send(query);
		return Ok(res);
	}

	[HttpPost("feedback/create-case")]
	[SwaggerOperation(Summary = "Create case")]
	[ProducesResponseType(typeof(CreateFeedbackResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> CreateFeedback([FromBody] CreateFeedbackCommand request)
	{
		var res = await _mediator.Send(request);
		return Ok(res);
	}

	[HttpPost("webhook/case-updates")]
	[SwaggerOperation(Summary = "Case Updates")]
	[ProducesResponseType(typeof(CaseUpdatesResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> CaseUpdates([FromBody] CaseUpdatesCommand request)
	{
		var res = await _mediator.Send(request);
		return Ok(res);
	}

	[HttpPost("deactivate-visitor-pass")]
	[SwaggerOperation(Summary = "Deactivate visitor pass")]
	[ProducesResponseType(typeof(DeactivateVisitorPassResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> DeactivateVisitorPass([FromBody] DeactivateVisitorPassCommand request)
	{
		var res = await _mediator.Send(request);
		return Ok(res);
	}

	[HttpGet("tenants/{tenantId}/questionnaires")]
	[SwaggerOperation(Summary = "Get questionnaire list")]
	[ProducesResponseType(typeof(GetQuestionnairesResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetQuestionnaires([FromQuery(Name = "page")] int? page, [FromQuery(Name = "limit")] int? limit, string tenantId, [FromQuery(Name = "projectId")] int? projectId, [FromHeader(Name = "lang")] string? lang)
	{
		var query = new GetQuestionnairesQuery(tenantId, page, limit, projectId, lang);
		var res = await _mediator.Send(query);
		return Ok(res);
	}

	[HttpGet("tenants/{tenantId}/questionnaires/history")]
	[SwaggerOperation(Summary = "Get questionnaire history list")]
	[ProducesResponseType(typeof(GetQuestionnaireHistoryResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetQuestionnaireHistory([FromQuery(Name = "page")] int? page, [FromQuery(Name = "limit")] int? limit, string tenantId, [FromQuery(Name = "projectId")] int? projectId, [FromHeader(Name = "lang")] string? lang)
	{
		var query = new GetQuestionnaireHistoryQuery(tenantId, page, limit, projectId, lang);
		var res = await _mediator.Send(query);
		return Ok(res);
	}

	[HttpGet("tenants/{tenantId}/questionnaires/detail/{questionnaireId}")]
	[SwaggerOperation(Summary = "Get questionnaire detail")]
	[ProducesResponseType(typeof(GetQuestionnaireDetailResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetQuestionnaireDetail(string tenantId, int questionnaireId, [FromHeader(Name = "lang")] string? lang)
	{
		var query = new GetQuestionnaireDetailQuery(tenantId, questionnaireId, lang);
		var res = await _mediator.Send(query);
		return Ok(res);
	}

	[HttpPost("submit-questionnaire")]
	[SwaggerOperation(Summary = "Deactivate visitor pass")]
	[ProducesResponseType(typeof(SubmitQuestionnaireResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> SubmitQuestionnaire([FromBody] SubmitQuestionnaireCommand request)
	{
		var res = await _mediator.Send(request);
		return Ok(res);
	}

	[HttpPost("webhook/onboarding-sync-updates")]
	[SwaggerOperation(Summary = "Onboarding Sync Updates")]
	[ProducesResponseType(typeof(OnboardingSyncUpdatesResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> OnboardingSyncUpdates([FromBody] OnboardingSyncUpdatesCommand request)
	{
		var res = await _mediator.Send(request);
		return Ok(res);
	}

	[HttpPost("GetDetailResidenceMemberByPersonID")]
	[SwaggerOperation(Summary = "Get Detail Residence Member By Person ID")]
	[ProducesResponseType(typeof(GetDetailResidenceMemberByPersonIDResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetDetailResidenceMemberByPersonID([FromBody] GetDetailResidenceMemberByPersonIDCommand request)
	{
		var res = await _mediator.Send(request);
		return Ok(res);
	}

	[HttpPost("payment/generate-prompt-pay-qr")]
	[SwaggerOperation(Summary = "Generate PromptPay QR Code")]
	[ProducesResponseType(typeof(GeneratePromptPayQrResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GeneratePromptPayQr([FromBody] GeneratePromptPayQrCommand body)
	{
		var res = await _mediator.Send(body);
		return Ok(res);
	}

	[HttpPost("payment/webhook/payment-status-callback")]
	[SwaggerOperation(Summary = "Payment Status Callback")]
	[ProducesResponseType(typeof(GetCallBackPaymentResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetCallBackPayment([FromBody] GetCallBackPaymentCommand request)
	{
		var res = await _mediator.Send(request);
		return Ok(res);
	}

	[HttpPost("payment/get-transactions")]
	[SwaggerOperation(Summary = "Get Transactions")]
	[ProducesResponseType(typeof(GetPaymentTransactionResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetPaymentTransaction([FromBody] GetPaymentTransactionCommand request)
	{
		var res = await _mediator.Send(request);
		return Ok(res);
	}
	
	[HttpPost("payment/payment-inquiry")]
	[SwaggerOperation(Summary = "Get Payment Inquiry")]
	[ProducesResponseType(typeof(GetPaymentInquiryResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetPaymentInquiry([FromBody] GetPaymentInquiryCommand request)
	{
		var res = await _mediator.Send(request);
		return Ok(res);
	}

	[HttpPost("meters-and-billing/get-latest-meter-reading")]
	[SwaggerOperation(Summary = "Get Latest Meter Reading")]
	[ProducesResponseType(typeof(GetLatestMeterReadingResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetLatestMeterReading([FromBody] GetLatestMeterReadingCommand request)
	{
		var res = await _mediator.Send(request);
		return Ok(res);
	}

	[HttpPost("meters-and-billing/get-billing-history")]
	[SwaggerOperation(Summary = "Get Billing History")]
	[ProducesResponseType(typeof(GetBillingHistoryResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetBillingHistory([FromBody] GetBillingHistoryCommand request)
	{
		var res = await _mediator.Send(request);
		return Ok(res);
	}

	[HttpPost("meters-and-billing/get-invoice-history")]
	[SwaggerOperation(Summary = "Get Invoice History")]
	[ProducesResponseType(typeof(GetInvoiceHistoryResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetInvoiceHistory([FromBody] GetInvoiceHistoryCommand request)
	{
		var res = await _mediator.Send(request);
		return Ok(res);
	}

	[HttpGet("meters-and-billing/get-invoice-details")]
	[SwaggerOperation(Summary = "Get Invoice Details")]
	[ProducesResponseType(typeof(GetInvoiceHistoryResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetInvoiceDetails(string tenantId, [FromQuery]string? invoiceId)
	{
		var query = new GetInvoiceDetailsQuery(tenantId, invoiceId);
		var res = await _mediator.Send(query);
		return Ok(res);
	}
	[HttpGet("meters-and-billing/get-receipt-details")]
	[SwaggerOperation(Summary = "Get Receipt Details")]
	[ProducesResponseType(typeof(GetInvoiceHistoryResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetReceiptDetails(string tenantId, [FromQuery] string? receiptId)
	{
		var query = new GetReceiptDetailsQuery(tenantId, receiptId);
		var res = await _mediator.Send(query);
		return Ok(res);
	}
}