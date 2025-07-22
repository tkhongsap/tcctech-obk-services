namespace TCCTOBK.OperationBackend.Application;

public class BannerSustainability
{
	public Guid? Id { get; set; }
	public int Type { get; set; }
	public string ImageURL { get; set; }
	public string FileName { get; set; }
	public string OriginalFileName { get; set; }
	public string? LabelLevel1 { get; set; }
	public string? LabelLevel2 { get; set; }
	public string? LabelLevel1TH { get; set; }
	public string? LabelLevel2TH { get; set; }
	public string? LabelLevel1CN { get; set; }
	public string? LabelLevel2CN { get; set; }
	public string? LabelIntroduce { get; set; }
	public string? LabelIntroduceTH { get; set; }
	public string? LabelIntroduceCN { get; set; }

	public bool IsDelete { get; set; }
	public bool IsChanged { get; set; }

	public BannerSustainability(int type, string imageurl, string fileName, string originalFileName, bool isdelete, bool ischanged, string? labellevel1, string? labellevel2, Guid? id, string? labellevel1TH, string? labellevel2TH, string? labellevel1CN, string? labellevel2CN, string? labelIntroduce, string? labelIntroduceTH, string? labelIntroduceCN)
	{
		Type = type;
		ImageURL = imageurl;
		FileName = fileName;
		OriginalFileName = originalFileName;
		LabelLevel1 = labellevel1;
		LabelLevel2 = labellevel2;
		Id = id;
		IsDelete = isdelete;
		IsChanged = ischanged;
		LabelLevel1TH = labellevel1TH;
		LabelLevel2TH = labellevel2TH;
		LabelLevel1CN = labellevel1CN;
		LabelLevel2CN = labellevel2CN;
		LabelIntroduce = labelIntroduce;
		LabelIntroduceTH = labelIntroduceTH;
		LabelIntroduceCN = labelIntroduceCN;
	}
}
