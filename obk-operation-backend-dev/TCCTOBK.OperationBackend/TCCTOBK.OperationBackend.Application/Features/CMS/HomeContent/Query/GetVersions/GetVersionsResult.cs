namespace TCCTOBK.OperationBackend.Application;

public record GetVersionsResult(int TotalRecords, List<HomeContentVersion> Data);

public record HomeContentVersion
{
	public Guid HCID { get; set; }
	public int Version { get; set; }
	public string? UpdatedDate { get; set; }
	public string? UpdatedBy { get; set; }
}