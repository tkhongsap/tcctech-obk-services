namespace TCCT.ServiceAbstraction.Application.Features.Certis.MasterData.PPM.StatusCodes;
public class StatusCodesResult
{
	public int Id { get; set; }
	public string Name { get; set; } = null!;
	public string DisplayName { get; set; } = null!;
	public string ColorCode { get; set; } = null!;
	public bool IsActive { get; set; }
}
