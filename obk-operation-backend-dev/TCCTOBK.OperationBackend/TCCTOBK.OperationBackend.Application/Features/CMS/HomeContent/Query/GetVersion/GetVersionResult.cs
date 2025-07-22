namespace TCCTOBK.OperationBackend.Application;

public class GetVersionResult
{
	public Guid HCID { get; set; }
	public string ImageURL { get; set; } = default!;
	public bool IsVisible { get; set; }
	public string Note { get; set; } = default!;
	public string OriginalFileName { get; set; } = default!;
	public string FileName { get; set; } = default!;
	public string UpdatedDateDisplay { get; set; } = default!;
	public string UpdatedByName { get; set; } = default!;
}
