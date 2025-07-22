using TCCT.ServiceAbstraction.Application.Configuration.Queries;
using TCCT.ServiceAbstraction.Application.Contracts.ServiceMindResidential;

namespace TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Query.GetPropertiesList;

public sealed class GetPropertiesListQueryHandler : IQueryHandler<GetPropertiesListQuery, GetPropertiesListResult>
{
	private readonly IServiceMindResidential _service;
	public GetPropertiesListQueryHandler(IServiceMindResidential service)
	{
		_service = service;
	}

	public async Task<GetPropertiesListResult> Handle(GetPropertiesListQuery request, CancellationToken cancellationToken)
	{
		var res = await _service.GetPropertiesList(request);
		GetPropertiesListResult response = new GetPropertiesListResult();
		response.tenantId = res.tenantId;
		foreach (var property in res.properties)
		{
			GetPropertiesListResultPropertyUnit item = new GetPropertiesListResultPropertyUnit
			{
				propertyUnitId = property.propertyUnitId,
				unitNumber = property.unitNumber,
				houseNumber = property.houseNumber,
				floorZone = property.floorZoneCode,
				buildingPhase = property.buildingPhaseName,
				projectName = property.projectsName,
				companyName = property.companyName,
				companyId = property.companyId,
				isPropertyOwner = property.isPropertyOwner,
				isPropertyResident = property.isPropertyResident,
				isDefault = property.isDefaultPropertyUnit,
				backgroundUrl = property.backgroundUrl,
				iconUrl = property.iconUrl,
				homeId = property.thirdPartyIntegration?.homeId,
				hideLogoFromFrontEnd = property.hideLogoFromFrontEnd,
				buildingId = property.buildingId,
				buildingPhaseCode = property.buildingPhaseCode,
				projectCode = property.projectCode,
				projectId = property.projectId,
				projectsName = property.projectsName,
				projectsNameThai = property.projectsNameThai,
				projectGeoLocation = property.projectGeoLocation
			};
			response.properties.Add(item);
		}
		return response;
	}
}

