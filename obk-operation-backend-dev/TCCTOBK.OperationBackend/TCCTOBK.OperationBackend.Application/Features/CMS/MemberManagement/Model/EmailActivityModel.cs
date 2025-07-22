namespace TCCTOBK.OperationBackend.Application.Features.CMS.MemberManagement.Model;

public class EmailActivityModel
{
	public string? RedirectURL { get; set; }
	public DateTime SendDate { get; set; }
	public string SendBy { get; set; } = default!;
	public string SendByName { get; set; } = default!;
}
