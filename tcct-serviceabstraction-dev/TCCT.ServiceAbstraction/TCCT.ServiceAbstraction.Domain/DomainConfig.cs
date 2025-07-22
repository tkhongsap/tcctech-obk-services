namespace TCCT.ServiceAbstraction.Domain;

public static class DomainConfig
{
	public const string SerilogConfigSection = "SerilogConfig";
	public const string CustomerKeycloakConfigSection = "CustomerConfig:Keycloak";
	public const string OperationKeycloakConfigSection = "OperationConfig:Keycloak";
	public const string LoggerKeycloakConfigSection = "LoggerConfig:Keycloak";
	public const string AirQualityConfigSection = "AirQualityConfig";
	public const string CertisConfigSection = "CertisConfig";
	public const string FinedayIvivaConfigSection = "FinedayIvivaConfig";
	public const string FinedayResidenceConfigSection = "FinedayResidenceConfig";
	public const string NetatmoConfigSection = "NetatmoConfig";
	public const string InnoflexConfigSection = "InnoflexConfig";
	public const string CarparkPaymentConfigSection = "CarparkPaymentConfig";
	public const string ResidentialConfigSection = "ResidentialConfig";
	public const string LBSConfigSection = "LBSConfig";
	public const string MTConfigSection = "MTConfig";
	public const string RedisConfigSection = "RedisConfig";
	public const string EVConfigSection = "EVConfig";
	public const string PaymentConfigSection = "PaymentConfig";

	public static string RunningEnvironment { get; set; } = null!;
	public static SerilogConfig Serilog { get; set; } = new();
	public static CustomerConfig Customer { get; set; } = new();
	public static OperationConfig Operation { get; set; } = new();
	public static LoggerConfig Logger { get; set; } = new();
	public static AirQualityConfig AirQuality { get; set; } = new();
	public static CertisConfig Certis { get; set; } = new();
	public static FinedayIvivaConfig FinedayIviva { get; set; } = new();
	public static FinedayResidenceConfig FinedayResidence { get; set; } = new();
	public static NetatmoConfig Netatmo { get; set; } = new();
	public static InnoflexConfig Innoflex { get; set; } = new();
	public static CarparkPaymentConfig CarparkPayment { get; set; } = new();
	public static ResidentialConfig Residential { get; set; } = new();
	public static LBSConfig LBS { get; set; } = new();
	public static MTConfig MT { get; set; } = new();
	public static RedisConfig Redis { get; set; } = new();
	public static EVConfig EV { get; set; } = new();
	public static PaymentConfig Payment { get; set; } = new();
}
