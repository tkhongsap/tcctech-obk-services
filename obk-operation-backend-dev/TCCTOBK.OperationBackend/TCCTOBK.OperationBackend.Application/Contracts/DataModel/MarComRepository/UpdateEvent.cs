
using TCCTOBK.OperationBackend.Application.Features.Sustainability.DigitalLibraryManagement.Command.DigitalLibrary;
using TCCTOBK.OperationBackend.Application.Features.Sustainability.SpecialEvent.Model;

namespace TCCTOBK.OperationBackend.Application;

public class EventDataModel
{
	public Guid? Id { get; set; }
	public string EventName { get; set; } = string.Empty;
	public bool Status { get; set; }
	public bool IsDontShowAgain { get; set; }
	public bool IsDelete { get; set; }
	public int Order { get; set; }
	public double Start { get; set; }
	public double? End { get; set; }
	public bool Alltime { get; set; }
	public SpecialEventLang Detail { get; set; } = new SpecialEventLang();

	public EventDataModel(string eventName, bool status, bool isDelete, int order, SpecialEventLang detail,Guid? id, double start, double? end,bool alltime,bool isDontShowAgain)
	{
		Id = id;
		EventName = eventName;
		Status = status;
		IsDelete = isDelete;
		Order = order;
		Detail = detail;
		Start = start;
		End = end;
		Alltime = alltime;
		IsDontShowAgain = isDontShowAgain;
	}
}