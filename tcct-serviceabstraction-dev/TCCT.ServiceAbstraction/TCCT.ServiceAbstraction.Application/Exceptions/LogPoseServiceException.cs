namespace TCCT.ServiceAbstraction.Application.Exceptions;
public class LogPoseServiceException : ServiceAbstractionException
{
	public static LogPoseServiceException LPS001 { get; } = new LogPoseServiceException(nameof(LPS001), "Wifi scan is empty.");
	public static LogPoseServiceException LPS002 { get; } = new LogPoseServiceException(nameof(LPS002), "Invalid wifi scan json format.");
	public static LogPoseServiceException LPS003 { get; } = new LogPoseServiceException(nameof(LPS003), "");
	public static LogPoseServiceException LPS004 { get; } = new LogPoseServiceException(nameof(LPS004), "");
	public static LogPoseServiceException LPS005 { get; } = new LogPoseServiceException(nameof(LPS005), "");

	private LogPoseServiceException(string code, string message) : base(code, message)
	{
	}
	private LogPoseServiceException(string code, string message, Exception innerexception) : base(code, message, innerexception)
	{
	}
}
