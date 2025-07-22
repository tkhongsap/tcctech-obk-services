namespace TCCT.ServiceAbstraction.Application.Features.Certis.MasterData.FMRelated.FMTechnicians.FMTechnicianServices;
public class FMTechnicianServiceResult
{
	public int Id { get; set; }
	public string TechnicianId { get; set; } = null!;
	public int LocationId { get; set; }
	public int ServiceCategoryId { get; set; }
}
