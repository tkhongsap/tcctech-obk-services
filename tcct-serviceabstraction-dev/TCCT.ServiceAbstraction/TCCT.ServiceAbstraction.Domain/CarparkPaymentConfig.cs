namespace TCCT.ServiceAbstraction.Domain;
public class CarparkPaymentConfig
{
	public string EndPoint { get; set; } = null!;
	public string ArgentoEndPoint { get; set; } = null!;
	public string ArgentoMerchantID { get; set; } = null!;
	public string ArgentoPrivateKey { get; set; } = null!;
	public string ArgentoMerchantIDOne89Carpark { get; set; } = null!;
	public string ArgentoPrivateKeyOne89Carpark { get; set; } = null!;
	public string SubCodeONE89Carpark { get; set; } = null!;
	public string Ref2One89Carpark { get; set; } = null!;
	public void SetEnvironmentVariables()
	{
		Environment.SetEnvironmentVariable("CARPARKPAYMENT_ENDPOINT", EndPoint);
		Environment.SetEnvironmentVariable("CARPARKPAYMENT_ARGENTOENDPOINT", ArgentoEndPoint);
		Environment.SetEnvironmentVariable("CARPARKPAYMENT_ARGENTOMERCHANTID", ArgentoMerchantID);
		Environment.SetEnvironmentVariable("CARPARKPAYMENT_ARGENTOPRIVATEKEY", ArgentoPrivateKey);
		Environment.SetEnvironmentVariable("CARPARKPAYMENT_ARGENTO_MERCHANTID_ONE89CARPARK", ArgentoMerchantIDOne89Carpark);
		Environment.SetEnvironmentVariable("CARPARKPAYMENT_ARGENTO_PRIVATEKEY_ONE89CARPARK", ArgentoPrivateKeyOne89Carpark);
		Environment.SetEnvironmentVariable("SUBCODE_ONE89_CARPARK", SubCodeONE89Carpark);
		Environment.SetEnvironmentVariable("CARPARKPAYMENT_REF2_ONE89_CARPARK", Ref2One89Carpark);
	}

	public void GetEnvironmentVariables()
	{
		EndPoint = Environment.GetEnvironmentVariable("CARPARKPAYMENT_ENDPOINT")!;
		ArgentoEndPoint = Environment.GetEnvironmentVariable("CARPARKPAYMENT_ARGENTOENDPOINT")!;
		ArgentoMerchantID = Environment.GetEnvironmentVariable("CARPARKPAYMENT_ARGENTOMERCHANTID")!;
		ArgentoPrivateKey = Environment.GetEnvironmentVariable("CARPARKPAYMENT_ARGENTOPRIVATEKEY")!;
		ArgentoMerchantIDOne89Carpark = Environment.GetEnvironmentVariable("CARPARKPAYMENT_ARGENTO_MERCHANTID_ONE89CARPARK")!;
		ArgentoPrivateKeyOne89Carpark = Environment.GetEnvironmentVariable("CARPARKPAYMENT_ARGENTO_PRIVATEKEY_ONE89CARPARK")!;
		SubCodeONE89Carpark = Environment.GetEnvironmentVariable("SUBCODE_ONE89_CARPARK")!;
		Ref2One89Carpark = Environment.GetEnvironmentVariable("CARPARKPAYMENT_REF2_ONE89_CARPARK")!;
	}
}
