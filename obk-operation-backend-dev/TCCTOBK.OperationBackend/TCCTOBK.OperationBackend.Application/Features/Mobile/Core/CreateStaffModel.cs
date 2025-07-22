namespace TCCTOBK.OperationBackend.Application.Features.Mobile.Core;
public class CreateStaffModel
{

	public string? fullName { get; set; }
	public string? firstName { get; set; }
	public string? lastName { get; set; }
	public string? company { get; set; }
	public string? staffId { get; set; }
	public string? username { get; set; }
	public bool? loginEnabled { get; set; } = false;
	public string? email { get; set; }
	public string? mobile { get; set; }
	public int status { get; set; }
}
