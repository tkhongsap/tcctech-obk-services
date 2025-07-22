namespace TCCT.ServiceAbstraction.Application.Features.Certis.MasterData.CWO.CWOType;
public class CWOTypeResult
{
	public int Id { get; set; }
	public string Name { get; set; } = null!;
	public List<object> Cwos { get; set; } = null!;
}
