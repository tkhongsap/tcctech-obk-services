namespace TCCT.ServiceAbstraction.Application.Features.Keycloak.EventsLog
{
	public class EventsLogRequest
	{
		public int Max { get; set; } = 100;
		public string? Type { get; set; }
		public DateOnly? DateFrom { get; set; }
		public DateOnly? DateTo { get; set; }
		public int? First { get; set; }
		public Guid? User { get; set; }
	}
}
