namespace TCCTOBK.OperationBackend.Application.Contracts.DataModel.ShiftRepository;
public class CreateShiftModel
{
	public string Name { get; set; }
	public TimeSpan StartTime { get; set; }
	public TimeSpan EndTime { get; set; }
	public TimeSpan AllowCheckInStart { get; set; }
	public TimeSpan AllowCheckInEnd { get; set; }
	public TimeSpan CheckoutTimeEnd { get; set; }
	public int IsOverNight { get; set; }
	public CreateShiftModel(string name, TimeSpan startTime, TimeSpan endTime, TimeSpan allowCheckInStart, TimeSpan allowCheckInEnd, TimeSpan checkOutTimeEnd, int isOverNight)
	{
		Name = name;
		StartTime = startTime;
		EndTime = endTime;
		AllowCheckInStart = allowCheckInStart;
		AllowCheckInEnd = allowCheckInEnd;
		CheckoutTimeEnd = checkOutTimeEnd;
		IsOverNight = isOverNight;
	}
}