namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.PPM.Technicians;
public class TechniciansResult
{
	public int Id { get; set; }
	public int WOId { get; set; }
	public string TechnicianId { get; set; }
	public DateTime TechnicianAssignedOn { get; set; }
	public string TechnicianAssignedBy { get; set; }
}
