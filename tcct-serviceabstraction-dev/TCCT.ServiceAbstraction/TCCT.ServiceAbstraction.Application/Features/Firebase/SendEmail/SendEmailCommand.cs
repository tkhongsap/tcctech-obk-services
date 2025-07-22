using TCCT.ServiceAbstraction.Application.Configuration.Commands;

namespace TCCT.ServiceAbstraction.Application.Features.Firebase.SendEmail;

public class SendEmailCommand : ICommand<SendEmailResult>
{
	public string FromEmail { get; set; }
	public string ToEmail { get; set; }
	public string Message { get; set; }
	public bool IsHtml { get; set; }

	public SendEmailCommand(string fromemail, string toemail, string message, bool ishtml)
	{
		FromEmail = fromemail;
		ToEmail = toemail;
		Message = message;
		IsHtml = ishtml;
	}
}

