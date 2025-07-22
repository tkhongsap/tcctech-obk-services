namespace TCCTOBK.OperationBackend.Domain;

public static class Constant
{
	public const int MEMBERSTATUS_PENDING = 1;
	public const int MEMBERSTATUS_GRANTED = 2;
	public const int MEMBERSTATUS_SUSPENDED = 0;
	public const int MEMBERSTATUS_DELETE = 3;

	public const int GUARD_TOUR_STATUS_ASSIGNED = 0;
	public const int GUARD_TOUR_STATUS_INPROGRESS = 1;
	public const int GUARD_TOUR_STATUS_COMPLETED = 2;
	public const int GUARD_TOUR_STATUS_SKIP = 3;
	public const int GUARD_TOUR_STATUS_READY_FOR_COMPLETED = 4;
	public const int GUARD_TOUR_STATUS_INCOMPLETE = 5;
	public const int GUARD_TOUR_STATUS_CANCELLED = 6;

	public const string INNOFLEX_AUTH_TYPE_ALL = "ALL";
	public const string INNOFLEX_AUTH_TYPE_FACE = "FACE";
	public const string INNOFLEX_AUTH_TYPE_CARD = "CARD";
	public const string INNOFLEX_AUTH_TYPE_QR = "QR";
	public const string INNOFLEX_AUTH_TYPE_FB = "FB";

	public const int INNOFLEX_STATUS_ALL = 0;
	public const int INNOFLEX_STATUS_SUCCESS = 1;
	public const int INNOFLEX_STATUS_FAILED = 2;

	public const int DIGITAL_STATUS_ACTIVE = 1;
	public const int DIGITAL_STATUS_INACTIVE = 2;
	public const int CONTENT_TYPE_HTML = 1;
	public const int CONTENT_TYPE_IMAGE = 2;
	public const int CONTENT_TYPE_YOUTUBE = 3;
	public const int CONTENT_TEMPLATE_CONTENT = 1;
	public const int CONTENT_TEMPLATE_LINK = 2;
	public const int TYPE_DIGITAL_LIBRARY = 1;
	public const int TYPE_CMS = 2;
	public const int TYPE_PR_BANNER = 3;
	public const int CONFIG_PR_BANNER = 1;
	public const int CONFIG_EVENT = 2;
	public const int TYPE_HERO_BANNER = 1;
	public const int TYPE_SPECIAL_EVENT = 2;
	public const int TYPE_EXPLORE = 3;
	public const int TYPE_CATEGORY = 4;
	public const int TYPE_CONTENT = 5;
	public const int TYPE_PIN = 6;


	public const string CERTIS_WORK_STATUS_NEW = "1";
	public const string CERTIS_WORK_STATUS_ASSIGNED = "2";
	public const string CERTIS_WORK_STATUS_ACKNOWLEDGEMENT = "3";
	public const string CERTIS_WORK_STATUS_INPROGRESS = "4";
	public const string CERTIS_WORK_STATUS_COMPLETED = "5";
	public const string CERTIS_WORK_STATUS_CLOSE = "6";
	public const string CERTIS_WORK_STATUS_REWORK = "7";
	public const string CERTIS_WORK_STATUS_CANCEL = "8";
	public const string CERTIS_WORK_STATUS_CLIENT_VERIFIED = "7";

	//tenent by app service
	public static readonly Guid TENANT_OBKCMS_ID = Guid.Parse("4199e4de-bdf8-48f8-a8a8-a5b31756a748");
	public static readonly Guid TENANT_OPERATION_APP_ID = Guid.Parse("caa4ebec-15c8-4d6b-9985-6d6b66f94e63");

	//master obk role opsapp
	public static readonly Guid TECHNICIAN_ROLE_ID = Guid.Parse(DomainConfig.OpsApp.TechnicianRoleId ?? "fcddbf6b-88b8-4fae-ade7-63150ce1f1ec");
	public static readonly Guid CLEANING_ROLE_ID = Guid.Parse(DomainConfig.OpsApp.CleaningRoleId ?? "18a79217-9fa7-460d-bccc-e74285b07531");
	public static readonly Guid SUPERVISOR_ROLE_ID = Guid.Parse(DomainConfig.OpsApp.SupervisorRoleId ?? "f2cf879b-34f3-41da-9445-ee3bc590f224");
	public static readonly Guid GUARD_ROLE_ID = Guid.Parse(DomainConfig.OpsApp.GuardRoleId ?? "19ff157d-e20b-48cd-adc7-385ef9f441d7");
	public static readonly Guid DCC_ROLE_ID = Guid.Parse(DomainConfig.OpsApp.DccRoleId ?? "d6016437-8b0f-4b0e-8175-5a11ffc480f5");
	public static readonly Guid FMC_MANAGER_ROLE_ID = Guid.Parse(DomainConfig.OpsApp.FmcManagerRoleId ?? "c01c5086-cfa5-44ca-89d7-baa2c1accea6");
	public static readonly Guid SOC_MANAGER_ROLE_ID = Guid.Parse(DomainConfig.OpsApp.SocManagerRoleId ?? "bd69a88e-d6c1-42a1-8a3a-628843459909");

	//client site
	public static readonly Guid OBK_CLIENT_SITE = Guid.Parse(DomainConfig.OpsApp.ObkClientSite ?? "3075169a-bb4c-463f-a602-dac99228ceac");
	public static readonly Guid PARQ_CLIENT_SITE = Guid.Parse(DomainConfig.OpsApp.ParqClientSite ?? "9b84961b-1de6-445b-bd19-12430950d226");

	//site name	
	public static readonly string PARQ_CLIENT_SITE_NAME = DomainConfig.OpsApp.ParqClientSiteName ?? "parq";
	public static readonly string OBK_CLIENT_SITE_NAME = DomainConfig.OpsApp.ObkClientSiteName ?? "obk";

	//site fullname
	public static readonly string PARQ_CLIENT_SITE_FULLNAME = "The PARQ";
	public static readonly string OBK_CLIENT_SITE_FULLNAME = "OBK";

	public static readonly Guid MOZART_GUID = Guid.Parse(DomainConfig.OpsApp.MozartGuid ?? "6df4fd62-9b47-4b21-80a5-f94517edfa52");
	//Master type role
	public static readonly int CERTIS_SUPERVISOR_ROLE_ID = int.Parse(DomainConfig.OpsApp.CertisSupervisorRoleId ?? "1");
	public static readonly int CERTIS_SOC_ROLE_ID = int.Parse(DomainConfig.OpsApp.CertisSocRoleId ?? "2");
	public static readonly int CERTIS_OSTECH_ROLE_ID = int.Parse(DomainConfig.OpsApp.CertisOstechRoleId ?? "3"); // CLEANING & TECHNICIAN
	public static readonly int CERTIS_DCC_ROLE_ID = int.Parse(DomainConfig.OpsApp.CertisDccRoleId ?? "4");
	public static readonly int CERTIS_FMC_MANAGER_ROLE_ID = int.Parse(DomainConfig.OpsApp.CertisFmcManagerRoleId ?? "5");
	public static readonly int CERTIS_SOC_MANAGER_ROLE_ID = int.Parse(DomainConfig.OpsApp.CertisSocManagerRoleId ?? "6");

	public static readonly int CERTIS_CLEANER_SERVICE_CATEGORY = int.Parse(DomainConfig.OpsApp.CertisCleanerServiceCategory ?? "21");
	public static readonly int CERTIS_SOC_SERVICE_CATEGORY = int.Parse(DomainConfig.OpsApp.CertisSocServiceCategory ?? "34");

	//CWO Display
	public static readonly int CWO_NEW_DISPLAY = -15;
	public static readonly int CWO_ASSIGN_DISPLAY = -15;
	public static readonly int CWO_INPROGRESS_DISPLAY = -15;
	public static readonly int CWO_COMPLETE_DISPLAY = -15;
	public static readonly int CWO_CLOSE_DISPLAY = -15;
	public static readonly int CWO_CLIENTVERIFY_DISPLAY = -15;
	public static readonly int CWO_CANCLE_DISPLAY = -15;
	public static readonly int CWO_DEFAULT_DISPLAY = -15;
	//PPM Display
	public static readonly int PPM_NEW_DISPLAY = -15;
	public static readonly int PPM_ASSIGN_DISPLAY = -15;
	public static readonly int PPM_INPROGRESS_DISPLAY = -15;
	public static readonly int PPM_COMPLETE_DISPLAY = -15;
	public static readonly int PPM_CLOSE_DISPLAY = -15;
	public static readonly int PPM_CLIENTVERIFY_DISPLAY = -15;
	public static readonly int PPM_CANCLE_DISPLAY = -15;
	public static readonly int PPM_DEFAULT_DISPLAY = -15;




	//notification template
	public const string CWO_MOZART_ASSIGN = "CWO_ASSIGN_SUPERVISOR";
	public const string CWO_REJECT_TECH = "CWO_REJECT_TECH";
	public const string CWO_ASSIGN = "CWO_ASSIGN";
	public const string CWO_REJECT = "CWO_REJECT";
	public const string CWO_ACK = "CWO_ACK";
	public const string CWO_PAUSE = "CWO_PAUSE";
	public const string CWO_RESUME = "CWO_RESUME";
	public const string CWO_COMPLETE = "CWO_COMPLETE";
	public const string CWO_CLOSE = "CWO_CLOSE";
	public const string CWO_REWORK = "CWO_REWORK";
	public const string CWO_CLIENT_VERIFIED = "CWO_CLIENT_VERIFIED";
	public const string CWO_CANCLE = "CWO_CANCLE";
	public const string PPM_MOZART_ASSIGN = "PPM_ASSIGN_SUPERVISOR";
	public const string PPM_REJECT = "PPM_REJECT";
	public const string PPM_ACK = "PPM_ACK";
	public const string PPM_COMPLETE = "PPM_COMPLETE";
	public const string PPM_CLOSE = "PPM_CLOSE";
	public const string PPM_REWORK = "PPM_REWORK";
	public const string PPM_REJECT_TECH = "PPM_REJECT_TECH";
	public const string PPM_ASSIGN = "PPM_ASSIGN";
	public const string GUATD_TOUR_ASSIGN = "GUATD_TOUR_ASSIGN";
	public const string GUATD_TOUR_CANCLE = "GUATD_TOUR_CANCLE";
	public const string GUATD_TOUR_CANCEL = "GUATD_TOUR_CANCEL";
	public const string INCIDENT_ASSIGN = "INCIDENT_ASSIGN";
	public const string TASK_INCIDENT_ASSIGN = "TASK_INCIDENT_ASSIGN";

	//notification message type
	public const int CWO_MESSAGE_TYPE = 1;
	public const int PPM_MESSAGE_TYPE = 2;
	public const int GUARD_TOUR_MESSAGE_TYPE = 3;
	public const int INCIDENT_MESSAGE_TYPE = 4;

	public const string NEW_RESET_PASSWORD = "P@ssw0rd";

	public static readonly string URGENTLOCATION = DomainConfig.OpsApp.UrgentLocation;
}



public static class OpAppConstant
{
	public const string TimeZoneTH = "SE Asia Standard Time";
	public const string TimeFormat = "dd MMM yyyy h:mm:sstt";
	public const string CWO_REJECT_PREFIX = "CWO_REJECT_";
	public const string CWO_REWORK_PREFIX = "CWO_REWORK_";
	public const string CWO_PAUSE_PREFIX = "CWO_PAUSE_";
	public const string CWO_RESUME_PREFIX = "CWO_RESUME_";
	public const string CWO_ACKNOWLEDGE_PREFIX = "CWO_ACKNOWLEDGE_";
	public const string CWO_COMPLETE_PREFIX = "CWO_COMPLETE_";

	public const string PPM_REJECT_PREFIX = "PPM_REJECT_";
	public const string PPM_PAUSE_PREFIX = "PPM_PAUSE_";
	public const string PPM_RESUME_PREFIX = "PPM_RESUME_";
	public const string PPM_ACKNOWLEDGE_PREFIX = "PPM_ACKNOWLEDGE_";
	public const string PPM_COMPLETE_PREFIX = "PPM_COMPLETE_";





	//Error Login Profile Code
	public const string USERNAME_PASSWORD_INVALID = "LF001";
	public const string USER_NOT_FOUND = "LF002";
	public const string FAIL_TO_LOAD_PROFILE = "LF003";
	public const string MOZART_LOST_CONECTION = "MLF001";
	public const string UNKNOW_ERROR = "UKE001";

	public static class PermissionCode
	{
		public static string M001 = "M001";
		public static string M002 = "M002";
		public static string M003 = "M003";
		public static string C001 = "C001";
		public static string C002 = "C002";
		public static string C003 = "C003";
		public static string C004 = "C004";
		public static string C005 = "C005";
		public static string C006 = "C006";
		public static string C007 = "C007";
		public static string C008 = "C008";
		public static string C009 = "C009";
		public static string C010 = "C010";
		public static string C011 = "C011";
		public static string C012 = "C012";
		public static string C013 = "C013";
		public static string C014 = "C014";
		public static string C015 = "C015";
		public static string C016 = "C016";
		public static string C017 = "C017";
		public static string P001 = "P001";
		public static string P002 = "P002";
		public static string P003 = "P003";
		public static string P004 = "P004";
		public static string P005 = "P005";
		public static string P006 = "P006";
		public static string P007 = "P007";
		public static string P008 = "P008";
		public static string P009 = "P009";
		public static string P010 = "P010";
		public static string P011 = "P011";
		public static string P012 = "P012";
		public static string G001 = "G001";
		public static string G002 = "G002";
		public static string G003 = "G003";
		public static string G004 = "G004";
		public static string G005 = "G005";
		public static string I001 = "I001";
		public static string I002 = "I002";
		public static string I003 = "I003";
	}


}
