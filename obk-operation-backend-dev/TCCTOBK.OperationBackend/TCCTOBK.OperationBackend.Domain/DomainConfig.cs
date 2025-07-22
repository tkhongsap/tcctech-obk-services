namespace TCCTOBK.OperationBackend.Domain;
public static class DomainConfig
{
	public const string SerilogConfigSection = "SerilogConfig";
	public static string MailConfigSection = "MailConfig";
	public static string KongConfigSection = "KongConfig";
	public static string CMSDBConfigSection = "CMSDBConfig";
	public static string CMSAPIConfigSection = "CMSAPIConfig";
	public static string AbstractionConfigSection = "AbstractionConfig";
	public static string OauthConfigSection = "OauthConfig";
	public static string FirebaseAdminConfigSection = "FirebaseAdminConfig";
	public static string MinioConfigSection = "MinioConfig";
	public static string ReportConfigSection = "ReportConfig";
	public static string CMSConfigSection = "CMSConfig";
	public static string RedisConfigSection = "RedisConfig";
	public static string OpsAppConfigSection = "OpsAppConfig";
	public static string FirebaseFCMSection = "FCMConfig";

	public static string RunningEnvironment { get; set; } = null!;
	public static SerilogConfig Serilog { get; set; } = new();
	public static MailConfig Mail { get; set; } = new();
	public static KongConfig Kong { get; set; } = new();
	public static CMSDBConfig CMSDB { get; set; } = new();
	public static CMSAPIConfig CMSAPI { get; set; } = new();
	public static AbstractionConfig Abstraction { get; set; } = new();
	public static OauthConfig Oauth { get; set; } = new();
	public static FirebaseAdminConfig FirebaseAdmin { get; set; } = new();
	public static MinioConfig Minio { get; set; } = new();
	public static ReportConfig Report { get; set; } = new();
	public static CMSConfig CMS { get; set; } = new();
	public static RedisConfig Redis { get; set; } = new();
	public static OpsAppConfig OpsApp { get; set; } = new();
	public static FirebaseFCMConfig FCM { get; set; } = new();
}

