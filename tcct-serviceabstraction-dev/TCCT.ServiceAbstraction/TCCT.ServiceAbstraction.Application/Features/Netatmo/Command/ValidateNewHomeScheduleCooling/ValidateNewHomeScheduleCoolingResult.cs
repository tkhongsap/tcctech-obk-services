using System.Text.Json.Serialization;
namespace TCCT.ServiceAbstraction.Application.Features.Netatmo.Command.ValidateNewHomeScheduleCooling;
public class ValidateNewHomeScheduleCoolingResult
{
	public required List<TimeTableTemplate> Timetable { get; set; }
}

public class TimeTableTemplate
{
	public int? zone_id { get; set; }
	public int? m_offset { get; set; }
}
public class DayOffset {
	[JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
	public string? Day { get; set; }
	[JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
	public int? OffsetStart { get; set; }
	[JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
	public int? OffsetEnd { get; set; }
	[JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
	public string? TimeReadable { get; set; }
	[JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
	public int? ZoneId { get; set; }
	[JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
	public string? ZoneName { get; set; }
	[JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
	public int? MOffset { get; set; }
	[JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
	public string? DateStart { get; set; }
	[JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
	public string? DateEnd { get; set; }
	[JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
	public string? TimeReadableEnd { get; set; }
	[JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
	public string? TimeStart { get; set; }
	[JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
	public string? TimeEnd { get; set; }
}