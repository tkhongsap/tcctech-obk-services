using TCCT.ServiceAbstraction.Application.Configuration.Queries;
using TCCT.ServiceAbstraction.Application.Contracts.ServiceMindResidential;

namespace TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Query.GetProfile;

public sealed class GetProfileQueryHandler : IQueryHandler<GetProfileQuery, GetProfileResult>
{
	private readonly IServiceMindResidential _service;
	public GetProfileQueryHandler(IServiceMindResidential service)
	{
		_service = service;
	}

	public async Task<GetProfileResult> Handle(GetProfileQuery request, CancellationToken cancellationToken)
	{
		var res = await _service.GetProfile(request);
		var name = res.isPropertyOwner ? res.propertyOwnerProfile.firstName + " " + res.propertyOwnerProfile.lastName : res.residentProfile.firstName + " " + res.residentProfile.lastName;
		var isActive = false;
		if (res.isPropertyOwner == true && isActive == false)
		{
			isActive = res.propertyOwnerProfile!.isActive;
		}
		if (res.isResident == true && isActive == false)
		{
			isActive = res.residentProfile!.isActive;
		}
		GetProfileResult response = new GetProfileResult
		{
			tenantId = res.id,
			name = name,
			email = res.email,
			userName = "",
			mobileNo = res.phoneNumber,
			address = "",
			userType = "",
			nationalIdTaxId = "",
			fax = "",
			isActive = isActive,
			phoneNo = res.phoneNumber,
			defaultUnit = res.defaultUnit.unitNumber,
			countryCode = res.countryCode,
			gender = res.residentProfile.gender,
			isResident = res.isResident,
			isPropertyOwner = res.isPropertyOwner,
			images = res.residentProfile.images,
			properties = res.properties.Select(property => new ProfileProperty
			{
				unitNumber = property.unitNumber,
				houseNumber = property.houseNumber,
				floorZone = property.floorZoneCode,
				buildingPhase = property.buildingPhaseName,
				projectName = property.projectsName,
				companyName = property.companyName,
				isPropertyOwner = property.isPropertyOwner,
				isPropertyResident = property.isPropertyResident,
				isDefault = property.isDefaultPropertyUnit,
				backgroundUrl = property.backgroundUrl,
				iconUrl = property.iconUrl,
				homeId = property.thirdPartyIntegration?.homeId,
				hideLogoFromFrontEnd = property.hideLogoFromFrontEnd
			}).ToList()
		};

		return response;
	}
}

