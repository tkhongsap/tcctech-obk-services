using TCCTOBK.OperationBackend.Application.Configuration.Queries;

namespace TCCTOBK.OperationBackend.Application;

public class GetResetPasswordQuery : IQuery<GetResetPasswordResult>
{
	public string ResetPasswordCode { get; set; } = default!;
	public GetResetPasswordQuery(string resetpasswordcode)
	{
		ResetPasswordCode = resetpasswordcode;
	}
}
