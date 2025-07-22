namespace TCCT.ServiceAbstraction.Application.Exceptions;
public class FinedayIvivaServiceException : ServiceAbstractionException
{
	public static FinedayIvivaServiceException FIS001 { get; } = new FinedayIvivaServiceException(nameof(FIS001), "Unknow error");
	public static FinedayIvivaServiceException FIS002 { get; } = new FinedayIvivaServiceException(nameof(FIS002), "Invalid username or password.");
	public static FinedayIvivaServiceException FIS003 { get; } = new FinedayIvivaServiceException(nameof(FIS003), "Invalid token.");
	public static FinedayIvivaServiceException FIS004 { get; } = new FinedayIvivaServiceException(nameof(FIS004), "Invalid user id.");
	public static FinedayIvivaServiceException FIS005 { get; } = new FinedayIvivaServiceException(nameof(FIS005), "Invalid datetime.");
	public static FinedayIvivaServiceException FIS006 { get; } = new FinedayIvivaServiceException(nameof(FIS006), "Validation falied.");

	private FinedayIvivaServiceException(string code, string message) : base(code, message)
	{
	}
	private FinedayIvivaServiceException(string code, string message, Exception innerexception) : base(code, message, innerexception)
	{
	}
}
