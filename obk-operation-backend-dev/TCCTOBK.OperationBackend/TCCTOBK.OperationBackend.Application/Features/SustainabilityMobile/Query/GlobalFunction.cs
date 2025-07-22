namespace TCCTOBK.OperationBackend.Application.Features.SustainabilityMobile.Query;

public class GlobalFunctionSustainability
{
	public static string GetTextLanguage(string sLanguage, string? sTextEN, string? sTextTH, string? sTextCN, bool isAllowNull = false)
	{
		string sResult = "";
		if (sLanguage == "en")
		{
			sResult = sTextEN + "";
		}
		else if (sLanguage == "th")
		{
			if (isAllowNull)
			{
				sResult = sTextTH + "";
			}
			else
			{
				sResult = !string.IsNullOrEmpty(sTextTH) ? sTextTH + "" : sTextEN + "";
			}
		}
		else if (sLanguage == "zh")
		{
			if (isAllowNull)
			{
				sResult = sTextCN + "";
			}
			else
			{
				sResult = !string.IsNullOrEmpty(sTextCN) ? sTextCN + "" : sTextEN + "";
			}
		}
		return sResult;
	}
}