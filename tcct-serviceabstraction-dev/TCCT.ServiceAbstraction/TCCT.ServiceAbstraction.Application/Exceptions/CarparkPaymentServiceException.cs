namespace TCCT.ServiceAbstraction.Application.Exceptions;
public class CarparkPaymentServiceException : ServiceAbstractionException
{
	public static CarparkPaymentServiceException CPS001 { get; } = new CarparkPaymentServiceException(nameof(CPS001), "Unknow error");
	public static CarparkPaymentServiceException CPS002 { get; } = new CarparkPaymentServiceException(nameof(CPS002), "Data not found."); // {"message":"ไม่พบข้อมูล","status":1,"data":null,"count":0}
	public static CarparkPaymentServiceException CPS003 { get; } = new CarparkPaymentServiceException(nameof(CPS003), "QR Exit"); // {"message":"QR Exit !","status":1,"data":null,"count":0}

	public static CarparkPaymentServiceException CPS004(string message)
	{
		return new CarparkPaymentServiceException(nameof(CPS004), $"Payment error, {message}");
	}
	public static CarparkPaymentServiceException CPS005(string message)
	{
		return new CarparkPaymentServiceException(nameof(CPS005), $"Unknow payment error, {message}");
	}
	public static CarparkPaymentServiceException CPS006 { get; } = new CarparkPaymentServiceException(nameof(CPS006), "Invalid datetime.");
	public static CarparkPaymentServiceException CPS007 { get; } = new CarparkPaymentServiceException(nameof(CPS007), "Validation falied.");
	public static CarparkPaymentServiceException CPS008 { get; } = new CarparkPaymentServiceException(nameof(CPS008), "Receipt not found.");
	public static CarparkPaymentServiceException CPS009 { get; } = new CarparkPaymentServiceException(nameof(CPS009), "Posted invalid data.");

	private CarparkPaymentServiceException(string code, string message) : base(code, message)
	{
	}
	private CarparkPaymentServiceException(string code, string message, Exception innerexception) : base(code, message, innerexception)
	{
	}
}
