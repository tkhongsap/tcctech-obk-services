namespace TCCTOBK.OperationBackend.Application.Features.Marcom.Query;

public class GlobalFunctionMarcom
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
	public static bool GetBoolLanguage(string sLanguage, bool isBoolEN, bool? isBoolTH, bool? isBoolCN)
	{
		bool isResult = false;
		if (sLanguage == "en")
		{
			isResult = isBoolEN;
		}
		else if (sLanguage == "th")
		{
			isResult = isBoolTH != null ? isBoolTH ?? false : isBoolEN;
		}
		else if (sLanguage == "zh")
		{
			isResult = isBoolCN != null ? isBoolCN ?? false : isBoolEN;
		}
		return isResult;
	}
	public static string GetDateText(DateTime? dStart, DateTime? dEnd)
	{
		string sResult = "";

		if (dStart != null && dEnd == null)
		{
			sResult = dStart.Value.ToString("dd MMM yyyy");
		}
		else if (dStart == null && dEnd != null)
		{
			sResult = dEnd.Value.ToString("dd MMM yyyy");
		}
		else if (dStart != null && dEnd != null)
		{
			//Same Year
			if (dStart.Value.Year == dEnd.Value.Year)
			{
				sResult = dStart.Value.ToString("dd MMM") + " - " + dEnd.Value.ToString("dd MMM yyyy");
			}
			else
			{
				sResult = dStart.Value.ToString("dd MMM yyyy") + " - " + dEnd.Value.ToString("dd MMM yyyy");
			}
		}
		return sResult;
	}
}