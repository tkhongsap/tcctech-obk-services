namespace TCCT.ServiceAbstraction.Application.Exceptions;
public class PaymentServiceException : ServiceAbstractionException
{
	public static PaymentServiceException CPS001(string innerexception)
	{
		return new PaymentServiceException(nameof(CPS001), $"Unknow error", new Exception(innerexception));
	}
	public static PaymentServiceException CPS002(string innerexception)
	{
		return new PaymentServiceException(nameof(CPS002), $"Data not found", new Exception(innerexception));
	}
	public static PaymentServiceException CPS003(string innerexception)
	{
		return new PaymentServiceException(nameof(CPS003), $"QR Exit", new Exception(innerexception));
	}
	public static PaymentServiceException CPS004(string message, string innerexception)
	{
		return new PaymentServiceException(nameof(CPS004), $"Payment error, {message}", new Exception(innerexception));
	}
	public static PaymentServiceException CPS005(string message, string innerexception)
	{
		return new PaymentServiceException(nameof(CPS005), $"Unknow payment error, {message}", new Exception(innerexception));
	}
	public static PaymentServiceException CPS006(string innerexception)
	{
		return new PaymentServiceException(nameof(CPS006), $"Invalid datetime", new Exception(innerexception));
	}
	public static PaymentServiceException CPS007(string innerexception)
	{
		return new PaymentServiceException(nameof(CPS007), $"Validation falied", new Exception(innerexception));
	}
	public static PaymentServiceException CPS008(string innerexception)
	{
		return new PaymentServiceException(nameof(CPS008), $"Receipt not found", new Exception(innerexception));
	}
	public static PaymentServiceException CPS009(string innerexception)
	{
		return new PaymentServiceException(nameof(CPS009), $"Posted invalid data", new Exception(innerexception));
	}

	private PaymentServiceException(string code, string message) : base(code, message)
	{
	}
	private PaymentServiceException(string code, string message, Exception innerexception) : base(code, message, innerexception)
	{
	}
}
