
namespace TCCTOBK.OperationBackend.Application.Contracts.DataModel.ShiftRepository;
public class UpdateShiftModel
{
	public int Id { get; set; }
	public string? Name { get; set; }
	public TimeSpan? StartTime { get; set; }
	public TimeSpan? EndTime { get; set; }
	public TimeSpan? AllowCheckInStart { get; set; }
	public TimeSpan? AllowCheckInEnd { get; set; }
	public TimeSpan? CheckoutTimeEnd { get; set; }
	public int? IsOverNight { get; set; }
	public UpdateShiftModel(int id, string? name, TimeSpan? startTime, TimeSpan? endTime, TimeSpan? allowCheckInStart, TimeSpan? allowCheckInEnd, TimeSpan? checkOutTimeEnd, int? isOverNight)
	{
		Id = id;
		Name = name;
		StartTime = startTime;
		EndTime = endTime;
		AllowCheckInStart = allowCheckInStart;
		AllowCheckInEnd = allowCheckInEnd;
		CheckoutTimeEnd = checkOutTimeEnd;
		IsOverNight = isOverNight;
	}
}

