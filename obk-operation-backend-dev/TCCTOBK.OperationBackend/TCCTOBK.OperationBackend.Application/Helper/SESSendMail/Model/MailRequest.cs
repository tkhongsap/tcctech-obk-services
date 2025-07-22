namespace TCCTOBK.OperationBackend.Application;

public class MailRequest
{
	public List<string>? ToEmail { get; set; }
	public string? Subject { get; set; }
	public string? Body { get; set; }
	public List<string>? CCToEmail { get; set; }
	public List<Attachments>? Attachments { get; set; }
	public MailRequest(List<string>? toEmail, string? subject, string? body, List<Attachments>? attachments, List<string>? ccToEmail)
	{
		ToEmail = toEmail;
		Subject = subject;
		Body = body;
		Attachments = attachments;
		CCToEmail = ccToEmail;
	}
}

public class Attachments
{
	public string? FileName { get; set; }
	public  byte[]? Data { get; set; }
}