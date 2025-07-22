namespace TCCT.ServiceAbstraction.Application.Exceptions;
public class FinedayResidenceServiceException : ServiceAbstractionException
{
	public static FinedayResidenceServiceException FRS001(string innerexception)
	{
		return new FinedayResidenceServiceException(nameof(FRS001), $"Unknow error", new Exception(innerexception));
	}
	public static FinedayResidenceServiceException FRS002(string innerexception)
	{
		return new FinedayResidenceServiceException(nameof(FRS002), $"Invalid username or password", new Exception(innerexception));
	}
	public static FinedayResidenceServiceException FRS003(string innerexception)
	{
		return new FinedayResidenceServiceException(nameof(FRS003), $"Invalid token", new Exception(innerexception));
	}
	public static FinedayResidenceServiceException FRS004(string innerexception)
	{
		return new FinedayResidenceServiceException(nameof(FRS004), $"Invalid user id", new Exception(innerexception));
	}
	public static FinedayResidenceServiceException FRS005(string innerexception)
	{
		return new FinedayResidenceServiceException(nameof(FRS005), $"Invalid datetime", new Exception(innerexception));
	}
	public static FinedayResidenceServiceException FRS006(string innerexception)
	{
		return new FinedayResidenceServiceException(nameof(FRS006), $"Validation falied", new Exception(innerexception));
	}
	public static FinedayResidenceServiceException FRS007(string message, string innerexception)
	{
		return new FinedayResidenceServiceException(nameof(FRS007), message, new Exception(innerexception));
	}

	private FinedayResidenceServiceException(string code, string message) : base(code, message)
	{
	}
	private FinedayResidenceServiceException(string code, string message, Exception innerexception) : base(code, message, innerexception)
	{
	}
}
