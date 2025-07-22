using TCCT.ServiceAbstraction.Application.Configuration.Queries;
using TCCT.ServiceAbstraction.Application.Contracts.ServiceMindResidential;

namespace TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Query.GetPropertieDetails;

public sealed class GetPropertieDetailsQueryHandler : IQueryHandler<GetPropertieDetailsQuery, GetPropertieDetailsResult>
{
	private readonly IServiceMindResidential _service;
	public GetPropertieDetailsQueryHandler(IServiceMindResidential service)
	{
		_service = service;
	}

	public async Task<GetPropertieDetailsResult> Handle(GetPropertieDetailsQuery request, CancellationToken cancellationToken)
	{
		var res = await _service.GetPropertieDetails(request);
		GetPropertieDetailsResult response = new GetPropertieDetailsResult();
		GetPropertieDetailsResultData property = new GetPropertieDetailsResultData
		{
			propertyUnitId = res.property.propertyUnitId,
			companyName = res.property.companyName,
			companyId = res.property.companyId,
			projectName = res.property.projectsName,
			buildingPhase = res.property.buildingPhaseName,
			floorZone = res.property.floorZoneCode,
			unitNumber = res.property.unitNumber,
			houseNumber = res.property.houseNumber,
			isDefault = res.property.isDefaultPropertyUnit,
			isPropertyOwner = res.property.isPropertyOwner,
			isPropertyResident = res.property.isPropertyResident,
			backgroundUrl = res.property.backgroundUrl,
			iconUrl = res.property.iconUrl,
			floors = res.property.floors,
			homeId = res.property.thirdPartyIntegration?.homeId,
			hideLogoFromFrontEnd = res.property.hideLogoFromFrontEnd,
			buildingId = res.property.buildingId,
			projectsNameThai = res.property.projectsNameThai,
			ownershipRatio = res.property.ownershipRatio,
			unitArea = res.property.UnitArea,
			projectId = res.property.projectId,
			directions = res.property.directions,
			propertyUnitTypeDetails = res.property.propertyUnitTypeDetails,
			warrantyStartDate = res.property.warrantyStartDate,
			warrantyEndDate = res.property.warrantyEndDate,
			insuranceStartDate = res.property.insuranceStartDate,
			insuranceEndDate = res.property.insuranceEndDate,
			projectGeoLocation = res.property.projectGeoLocation,
			bimData = res.property.bimData
		};

		response.property = property;
		response.unansweredQuestionnaires = res.unansweredQuestionnaires;

		return response;
	}
}

