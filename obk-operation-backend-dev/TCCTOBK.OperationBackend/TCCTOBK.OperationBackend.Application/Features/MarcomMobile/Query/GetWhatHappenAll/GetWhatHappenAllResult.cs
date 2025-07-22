
using TCCTOBK.OperationBackend.Application.Features.Marcom.Query.GetMainContent;

namespace TCCTOBK.OperationBackend.Application.Features.Marcom.Query.GetWhatHappenAll;
// What Happen All
public class WhatHappenAllResult : ResultApi
{
	public List<WhatHappenCategory> lstCategory { get; set; } = new();
	public List<ContentCardWhatHappenItem> lstWhatHappen { get; set; } = new();
}
public class WhatHappenCategory
{
	public Guid sID { get; set; }
	public string sCategoryName { get; set; } = string.Empty;
}
public class WhatHappenCategoryCatch
{
	public Guid sID { get; set; }
	public string sCategoryNameEN { get; set; } = string.Empty;
	public string sCategoryNameTH { get; set; } = string.Empty;
	public string sCategoryNameCN { get; set; } = string.Empty;
}

//Result
public class ResultApi
{
	public int nStatusCode { get; set; } = 200;

	public string? sMessage { get; set; }
}
