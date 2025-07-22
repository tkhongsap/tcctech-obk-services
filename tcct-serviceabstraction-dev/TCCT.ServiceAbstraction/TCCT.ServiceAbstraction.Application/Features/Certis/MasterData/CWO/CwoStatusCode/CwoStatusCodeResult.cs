namespace TCCT.ServiceAbstraction.Application.Features.Certis.MasterData.CWO.CWOStatusCode;
public class CWOStatusCodeResult
{
	public int Id { get; set; }
	public string Name { get; set; } = null!;
	public string DisplayName { get; set; } = string.Empty;
	public string ColorCode { get; set; } = null!;
	public bool IsActive { get; set; }
}
