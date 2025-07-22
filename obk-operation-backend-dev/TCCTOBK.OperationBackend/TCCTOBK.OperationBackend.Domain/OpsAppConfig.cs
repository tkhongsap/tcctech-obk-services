using System;

namespace TCCTOBK.OperationBackend.Domain;

public class OpsAppConfig
{
	public string GuardTourId { get; set; } = null!;
	public string CertisCleanerServiceCategory { get; set; } = null!;
	public string CertisSocServiceCategory { get; set; } = null!;
	public string TechnicianRoleId { get; set; } = null!;
	public string CleaningRoleId { get; set; } = null!;
	public string SupervisorRoleId { get; set; } = null!;
	public string GuardRoleId { get; set; } = null!;
	public string DccRoleId { get; set; } = null!;
	public string FmcManagerRoleId { get; set; } = null!;
	public string SocManagerRoleId { get; set; } = null!;
	public string ObkClientSite { get; set; } = null!;
	public string ParqClientSite { get; set; } = null!;
	public string ParqClientSiteName { get; set; } = null!;
	public string ObkClientSiteName { get; set; } = null!;
	public string MozartGuid { get; set; } = null!;
	public string CertisSupervisorRoleId { get; set; } = null!;
	public string CertisSocRoleId { get; set; } = null!;
	public string CertisOstechRoleId { get; set; } = null!;
	public string CertisDccRoleId { get; set; } = null!;
	public string CertisFmcManagerRoleId { get; set; } = null!;
	public string CertisSocManagerRoleId { get; set; } = null!;
	public string UrgentLocation { get; set; } = null!;
	public string PPMNewDisplay { get; set; } = "15";
	public string PPMAssignedDisplay { get; set; } = "15";
	public string PPMInprogressDisplay { get; set; } = "15";
	public string PPMCompletedDisplay { get; set; } = "15";
	public string PPMCloseDisplay { get; set; } = "15";
	public string PPMClientVerifyDisplay { get; set; } = "15";
	public string PPMCancelDisplay { get; set; } = "15";
	public string PPMDefualtDisplay { get; set; } = "15";
	public void GetEnvironmentVariables()
	{
		GuardTourId = Environment.GetEnvironmentVariable("GUARDTOUR_ID")!;
		CertisCleanerServiceCategory = Environment.GetEnvironmentVariable("CONSTANT_CERTIS_CLEANER_SERVICE_CATEGORY")!;
		CertisSocServiceCategory = Environment.GetEnvironmentVariable("CONSTANT_CERTIS_SOC_SERVICE_CATEGORY")!;
		TechnicianRoleId = Environment.GetEnvironmentVariable("CONSTANT_TECHNICIAN_ROLE_ID")!;
		CleaningRoleId = Environment.GetEnvironmentVariable("CONSTANT_CLEANING_ROLE_ID")!;
		SupervisorRoleId = Environment.GetEnvironmentVariable("CONSTANT_SUPERVISOR_ROLE_ID")!;
		GuardRoleId = Environment.GetEnvironmentVariable("CONSTANT_GUARD_ROLE_ID")!;
		DccRoleId = Environment.GetEnvironmentVariable("CONSTANT_DCC_ROLE_ID")!;
		FmcManagerRoleId = Environment.GetEnvironmentVariable("CONSTANT_FMC_MANAGER_ROLE_ID")!;
		SocManagerRoleId = Environment.GetEnvironmentVariable("CONSTANT_SOC_MANAGER_ROLE_ID")!;
		ObkClientSite = Environment.GetEnvironmentVariable("CONSTANT_OBK_CLIENT_SITE")!;
		ParqClientSite = Environment.GetEnvironmentVariable("CONSTANT_PARQ_CLIENT_SITE")!;
		ParqClientSiteName = Environment.GetEnvironmentVariable("CONSTANT_PARQ_CLIENT_SITE_NAME")!;
		ObkClientSiteName = Environment.GetEnvironmentVariable("CONSTANT_OBK_CLIENT_SITE_NAME")!;
		MozartGuid = Environment.GetEnvironmentVariable("CONSTANT_MOZART_GUID")!;
		CertisSupervisorRoleId = Environment.GetEnvironmentVariable("CONSTANT_CERTIS_SUPERVISOR_ROLE_ID")!;
		CertisSocRoleId = Environment.GetEnvironmentVariable("CONSTANT_CERTIS_SOC_ROLE_ID")!;
		CertisOstechRoleId = Environment.GetEnvironmentVariable("CONSTANT_CERTIS_OSTECH_ROLE_ID")!;
		CertisDccRoleId = Environment.GetEnvironmentVariable("CONSTANT_CERTIS_DCC_ROLE_ID")!;
		CertisFmcManagerRoleId = Environment.GetEnvironmentVariable("CONSTANT_CERTIS_FMC_MANAGER_ROLE_ID")!;
		CertisSocManagerRoleId = Environment.GetEnvironmentVariable("CONSTANT_CERTIS_SOC_MANAGER_ROLE_ID")!;
		UrgentLocation = Environment.GetEnvironmentVariable("CONSTANT_URGENT_LOCATION")!;

		PPMNewDisplay = Environment.GetEnvironmentVariable("PPM_NEW_DISPLAY")!;
		PPMAssignedDisplay = Environment.GetEnvironmentVariable("PPM_ASSIGN_DISPLAY")!;
		PPMInprogressDisplay = Environment.GetEnvironmentVariable("PPM_INPROGRESS_DISPLAY")!;
		PPMCompletedDisplay = Environment.GetEnvironmentVariable("PPM_COMPLETE_DISPLAY")!;
		PPMCloseDisplay = Environment.GetEnvironmentVariable("PPM_CLOSE_DISPLAY")!;
		PPMClientVerifyDisplay = Environment.GetEnvironmentVariable("PPM_CLIENTVERIFY_DISPLAY")!;
		PPMDefualtDisplay = Environment.GetEnvironmentVariable("PPM_DEFAULT_DISPLAY")!;
		PPMCancelDisplay = Environment.GetEnvironmentVariable("PPM_CANCLE_DISPLAY")!;

	}

	public void SetEnvironmentVariables()
	{
		Environment.SetEnvironmentVariable("GUARDTOUR_ID", GuardTourId);
		Environment.SetEnvironmentVariable("CONSTANT_CERTIS_CLEANER_SERVICE_CATEGORY", CertisCleanerServiceCategory);
		Environment.SetEnvironmentVariable("CONSTANT_CERTIS_SOC_SERVICE_CATEGORY", CertisSocServiceCategory);
		Environment.SetEnvironmentVariable("CONSTANT_TECHNICIAN_ROLE_ID", TechnicianRoleId);
		Environment.SetEnvironmentVariable("CONSTANT_CLEANING_ROLE_ID", CleaningRoleId);
		Environment.SetEnvironmentVariable("CONSTANT_SUPERVISOR_ROLE_ID", SupervisorRoleId);
		Environment.SetEnvironmentVariable("CONSTANT_GUARD_ROLE_ID", GuardRoleId);
		Environment.SetEnvironmentVariable("CONSTANT_DCC_ROLE_ID", DccRoleId);
		Environment.SetEnvironmentVariable("CONSTANT_FMC_MANAGER_ROLE_ID", FmcManagerRoleId);
		Environment.SetEnvironmentVariable("CONSTANT_SOC_MANAGER_ROLE_ID", SocManagerRoleId);
		Environment.SetEnvironmentVariable("CONSTANT_OBK_CLIENT_SITE", ObkClientSite);
		Environment.SetEnvironmentVariable("CONSTANT_PARQ_CLIENT_SITE", ParqClientSite);
		Environment.SetEnvironmentVariable("CONSTANT_PARQ_CLIENT_SITE_NAME", ParqClientSiteName);
		Environment.SetEnvironmentVariable("CONSTANT_OBK_CLIENT_SITE_NAME", ObkClientSiteName);
		Environment.SetEnvironmentVariable("CONSTANT_MOZART_GUID", MozartGuid);
		Environment.SetEnvironmentVariable("CONSTANT_CERTIS_SUPERVISOR_ROLE_ID", CertisSupervisorRoleId);
		Environment.SetEnvironmentVariable("CONSTANT_CERTIS_SOC_ROLE_ID", CertisSocRoleId);
		Environment.SetEnvironmentVariable("CONSTANT_CERTIS_OSTECH_ROLE_ID", CertisOstechRoleId);
		Environment.SetEnvironmentVariable("CONSTANT_CERTIS_DCC_ROLE_ID", CertisDccRoleId);
		Environment.SetEnvironmentVariable("CONSTANT_CERTIS_FMC_MANAGER_ROLE_ID", CertisFmcManagerRoleId);
		Environment.SetEnvironmentVariable("CONSTANT_CERTIS_SOC_MANAGER_ROLE_ID", CertisSocManagerRoleId);
		Environment.SetEnvironmentVariable("CONSTANT_URGENT_LOCATION", UrgentLocation);
		Environment.SetEnvironmentVariable("PPM_NEW_DISPLAY", PPMNewDisplay);
		Environment.SetEnvironmentVariable("PPM_ASSIGN_DISPLAY", PPMAssignedDisplay);
		Environment.SetEnvironmentVariable("PPM_INPROGRESS_DISPLAY", PPMInprogressDisplay);
		Environment.SetEnvironmentVariable("PPM_COMPLETE_DISPLAY", PPMCompletedDisplay);
		Environment.SetEnvironmentVariable("PPM_CLOSE_DISPLAY", PPMCloseDisplay);
		Environment.SetEnvironmentVariable("PPM_CLIENTVERIFY_DISPLAY", PPMClientVerifyDisplay);
		Environment.SetEnvironmentVariable("PPM_DEFAULT_DISPLAY", PPMDefualtDisplay);
		Environment.SetEnvironmentVariable("PPM_CANCLE_DISPLAY", PPMCancelDisplay);
	}
}