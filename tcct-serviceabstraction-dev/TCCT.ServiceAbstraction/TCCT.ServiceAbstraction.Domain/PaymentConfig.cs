namespace TCCT.ServiceAbstraction.Domain;
public class PaymentConfig
{
	public string ArgentoEndPoint { get; set; } = null!;
	public string ArgentoMerchantIDOne89EV { get; set; } = null!;
	public string ArgentoPrivateKeyOne89EV { get; set; } = null!;
	public string SubCodeOne89EV { get; set; } = null!;
	public string Ref2One89EV { get; set; } = null!;
	public string ArgentoMerchantIDOne89Electric { get; set; } = null!;
	public string ArgentoPrivateKeyOne89Electric { get; set; } = null!;
	public string SubCodeOne89Electric { get; set; } = null!;	
	public string Ref2One89Electric { get; set; } = null!;
	public string ArgentoMerchantIDOne89Bill { get; set; } = null!;
	public string ArgentoPrivateKeyOne89Bill { get; set; } = null!;
	public string SubCodeOne89Bill { get; set; } = null!;
	public string Ref2One89Bill { get; set; } = null!;
	public void SetEnvironmentVariables()
	{
		Environment.SetEnvironmentVariable("PAYMENT_ARGENTOENDPOINT", ArgentoEndPoint);
		Environment.SetEnvironmentVariable("PAYMENT_ARGENTO_MERCHANTID_ONE89EV", ArgentoMerchantIDOne89EV);
		Environment.SetEnvironmentVariable("PAYMENT_ARGENTO_PRIVATEKEY_ONE89EV", ArgentoPrivateKeyOne89EV);
		Environment.SetEnvironmentVariable("SUBCODE_ONE89_EV", SubCodeOne89EV);
		Environment.SetEnvironmentVariable("PAYMENT_REF2_ONE89_EV", Ref2One89EV);
		Environment.SetEnvironmentVariable("PAYMENT_ARGENTO_MERCHANTID_ONE89ELECTRIC", ArgentoMerchantIDOne89Electric);
		Environment.SetEnvironmentVariable("PAYMENT_ARGENTO_PRIVATEKEY_ONE89ELECTRIC", ArgentoPrivateKeyOne89Electric);
		Environment.SetEnvironmentVariable("SUBCODE_ONE89_ELECTRIC", SubCodeOne89Electric);
		Environment.SetEnvironmentVariable("PAYMENT_REF2_ONE89_ELECTRIC", Ref2One89Electric);
		Environment.SetEnvironmentVariable("PAYMENT_ARGENTO_MERCHANTID_ONE89BILL", ArgentoMerchantIDOne89Bill);
		Environment.SetEnvironmentVariable("PAYMENT_ARGENTO_PRIVATEKEY_ONE89BILL", ArgentoPrivateKeyOne89Bill);
		Environment.SetEnvironmentVariable("SUBCODE_ONE89_BILL", SubCodeOne89Bill);
		Environment.SetEnvironmentVariable("PAYMENT_REF2_ONE89_BILL", Ref2One89Bill);
	}

	public void GetEnvironmentVariables()
	{
		ArgentoEndPoint = Environment.GetEnvironmentVariable("PAYMENT_ARGENTOENDPOINT")!;
		ArgentoMerchantIDOne89EV = Environment.GetEnvironmentVariable("PAYMENT_ARGENTO_MERCHANTID_ONE89EV")!;
		ArgentoPrivateKeyOne89EV = Environment.GetEnvironmentVariable("PAYMENT_ARGENTO_PRIVATEKEY_ONE89EV")!;
		SubCodeOne89EV = Environment.GetEnvironmentVariable("SUBCODE_ONE89_EV")!;
		Ref2One89EV = Environment.GetEnvironmentVariable("PAYMENT_REF2_ONE89_EV")!;
		ArgentoMerchantIDOne89Electric = Environment.GetEnvironmentVariable("PAYMENT_ARGENTO_MERCHANTID_ONE89ELECTRIC")!;
		ArgentoPrivateKeyOne89Electric = Environment.GetEnvironmentVariable("PAYMENT_ARGENTO_PRIVATEKEY_ONE89ELECTRIC")!;
		SubCodeOne89Electric = Environment.GetEnvironmentVariable("SUBCODE_ONE89_ELECTRIC")!;
		Ref2One89Electric = Environment.GetEnvironmentVariable("PAYMENT_REF2_ONE89_ELECTRIC")!;
		ArgentoMerchantIDOne89Bill = Environment.GetEnvironmentVariable("PAYMENT_ARGENTO_MERCHANTID_ONE89BILL")!;
		ArgentoPrivateKeyOne89Bill = Environment.GetEnvironmentVariable("PAYMENT_ARGENTO_PRIVATEKEY_ONE89BILL")!;
		SubCodeOne89Bill = Environment.GetEnvironmentVariable("SUBCODE_ONE89_BILL")!;
		Ref2One89Bill = Environment.GetEnvironmentVariable("PAYMENT_REF2_ONE89_BILL")!;
	}
}
