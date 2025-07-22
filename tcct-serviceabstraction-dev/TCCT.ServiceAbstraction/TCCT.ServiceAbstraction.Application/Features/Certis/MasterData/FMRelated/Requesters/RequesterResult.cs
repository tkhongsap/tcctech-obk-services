namespace TCCT.ServiceAbstraction.Application.Features.Certis.MasterData.FMRelated.Requesters;
public class RequesterResult
{
	public int Id { get; set; }
	public string Name { get; set; } = null!;
	public int RequesterTypeId { get; set; }
	public string Email { get; set; } = null!;
}
