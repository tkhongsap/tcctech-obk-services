namespace TCCTOBK.OperationBackend.Application;

public class PPMList
{
	public int PPMID { get; set; }
	public string? ProblemType { get; set; }
	public string Description { get; set; } = "";
	public string PPMMasterWorkID { get; set; } = "";
	public string CreatedDate { get; set; } = "";
	public int Priority { get; set; }
	public int Status { get; set; }
	public string Location { get; set; }
	public int FrequencyTypes { get; set; }
	public string FrequencyTypesText { get; set; }
	public string PPMWorkId { get; set; }
}
