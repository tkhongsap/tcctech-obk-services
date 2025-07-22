namespace TCCT.ServiceAbstraction.Application.Features.Netatmo.Command.SwitchHomeSchedule;
public class SwitchHomeScheduleRequest
{
	public string operation { get; set; }
	public string homeid { get; set; }
	public string? scheduleid { get; set; }
	public string scheduletype { get; set; }
	public bool? selected { get; set; }
	public string? tenantid { get; set; }
}
