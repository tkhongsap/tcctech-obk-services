namespace TCCTOBK.OperationBackend.Application.GetCurrentVersion;

public class GetCurrentVersionResult
{
	public int Version { get; set; }
	public DateTime UpdatedDate { get; set; }
	public string UpdatedBy { get; set; } = default!;
	public string? UpdatedDateDisplay => UpdatedDate.ToString("dd MMMM yyyy");
}
