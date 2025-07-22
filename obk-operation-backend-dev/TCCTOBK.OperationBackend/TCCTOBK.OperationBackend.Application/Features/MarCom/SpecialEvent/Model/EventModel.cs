
using TCCTOBK.OperationBackend.Application.Features.Sustainability.DigitalLibraryManagement.Command.DigitalLibrary;

namespace TCCTOBK.OperationBackend.Application.Features.Sustainability.SpecialEvent.Model;
public class SpecialEventModel
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
}


public class SpecialEventLang
{
	public SpecialEventDetail En { get; set; } = new SpecialEventDetail();
	public SpecialEventDetail Th { get; set; } = new SpecialEventDetail();
	public SpecialEventDetail Cn { get; set; } = new SpecialEventDetail();
}


public class SpecialEventDetail
{
	public string? ImageURL { get; set; }
	public string? FileName { get; set; }
	public string? OriginalFileName { get; set; }
}