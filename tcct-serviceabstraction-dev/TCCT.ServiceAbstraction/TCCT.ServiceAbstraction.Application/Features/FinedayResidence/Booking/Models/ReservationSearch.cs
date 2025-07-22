namespace TCCT.ServiceAbstraction.Application.Features.FinedayResidence.Booking.Models;

public class ReservationSearch
{
	public int? Page { get; set; }
	public int? Perpage { get; set; }
	public bool? History { get; set; }
}