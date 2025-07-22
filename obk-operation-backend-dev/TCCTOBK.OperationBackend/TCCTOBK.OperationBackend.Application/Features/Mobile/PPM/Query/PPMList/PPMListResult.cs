namespace TCCTOBK.OperationBackend.Application;

public class PPMListResult
{
	public int Items { get; set; }
	public int NEWItems { get; set; }
	public int ACKNOWLEDGEMENTItems { get; set; }
	public int INPROGRESSItems { get; set; }
	public int ADDSIGNCOUNT { get; set; }
	public int COMPLETEDItems { get; set; }
	public int CLOSEDItems { get; set; }
	public int CLIENTVERIFIEDItems { get; set; }
	public int CANCELLEDItems { get; set; }
	public int VERIFYItem { get; set; }

	public List<PPMResult> data { get; set; } = new();

}

public class PPMResult
{
	public string LocationName { get; set; } = null!;
	public List<PPMList> Data { get; set; } = new List<PPMList>();
}
