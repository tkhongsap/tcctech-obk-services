
using TCCTOBK.OperationBackend.Application.Features.Marcom.Happening.Model;
using TCCTOBK.OperationBackend.Application.Features.Sustainability.DigitalLibraryManagement.Command.DigitalLibrary;
using TCCTOBK.OperationBackend.Application.Features.Sustainability.SpecialEvent.Model;

namespace TCCTOBK.OperationBackend.Application;

public class HappeningDataModel
{
	public Guid? Id { get; set; }
	public Guid? Parent { get; set; }
	public bool Status { get; set; }
	public bool IsShowRelate { get; set; }
	public bool IsArtC { get; set; }
	public bool IsDelete { get; set; }
	public bool IsCategory { get; set; }
	public bool IsHasSub { get; set; }
	public bool IsPin { get; set; }
	public int Order { get; set; }
	public double? Start { get; set; }
	public double? End { get; set; }
	public bool Alltime { get; set; }
	public double? StartEvent { get; set; }
	public double? EndEvent { get; set; }
	public string? LinkToURL {get;set;}
	public int Type { get; set; }
	public int SystemType { get; set; }
	public int ArtType { get; set; }

	public List<string>? Tag { get; set; } = new List<string>();

	public HappeningLang Detail { get; set; } = new HappeningLang();

	public HappeningDataModel(Guid? id, bool status, bool isShowRelate, bool isArtC, bool isDelete, int order, double? start, double? end, bool alltime, double? startEvent, double? endEvent, string? linkToURL, int type, List<string>? tag, HappeningLang detail, bool isCategory, Guid? parent,bool isPin, int systemType, int artType)
	{
		Id = id;
		Status = status;
		IsDelete = isDelete;
		Order = order;
		Detail = detail;
		Start = start;
		End = end;
		Alltime = alltime;
		IsShowRelate = isShowRelate;
		IsArtC = isArtC;
		StartEvent = startEvent;
		EndEvent = endEvent;
		LinkToURL = linkToURL;
		Type = type;
		Tag = tag;
		IsCategory = isCategory;
		Parent = parent;
		IsPin = isPin;
		SystemType = systemType;
		ArtType = artType;
	}
}