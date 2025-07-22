using NPOI.SS.UserModel;
using NPOI.XSSF.UserModel;
using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Application.Features.Report.Attendant.Query.Model;

namespace TCCTOBK.OperationBackend.Application;

public class GetReportAttendantHandler : IQueryHandler<GetReportAttendantQuery, GetReportAttendantResult>
{
	IMailService _msr;
	IUnitOfWork _uow;
	public GetReportAttendantHandler(IMailService msr, IUnitOfWork uow)
	{
		_msr = msr;
		_uow = uow;
	}

	public async Task<GetReportAttendantResult> Handle(GetReportAttendantQuery request, CancellationToken cancellationToken)
	{
		var dateNow = DateTime.Now;
		var shiftName = request.ShiftName;
		var shiftData = await _uow.ShiftRepository.GetByName(shiftName);
		string shiftDisplay = $"{shiftName} {shiftData.StartTime}-{shiftData.EndTime}";
		if (request.Date != null) dateNow = Convert.ToDateTime(request.Date);
		var dateCheck = dateNow;
		if (shiftData.isOverNight == 1 && request.Date == null)
		{
			dateCheck = dateCheck.AddDays(-1);
		}
		var dataList = await _uow.ShiftManPowerRequestRepository.GetAll(shiftName, dateCheck);
		List<AttendantReport> items = new List<AttendantReport>();
		foreach (var item in dataList)
		{
			var attendantCount = await _uow.AttendanceRepository.GetAllCount(shiftName, dateCheck.ToString("yyyy-MM-dd"), item.Company, item.BaseLocation, item.Role);
			items.Add(new AttendantReport
			{
				BaseLocation = item.BaseLocation,
				Company = item.Company,
				Role = item.Role,
				Demand = item.Demand,
				Deployed = attendantCount,
				Shortfall = item.Demand - attendantCount
			});
		}

		List<Attachments> attachments = new List<Attachments>();
		MemoryStream ms = new MemoryStream();
		var newFile = $"manpower-report-{shiftName}-{dateCheck.ToString("yyyy-MM-dd")}{DateTime.Now.ToString("-HH-mm")}.xlsx";
		using (var fs = new FileStream(newFile, FileMode.Create, FileAccess.Write))
		{
			IWorkbook workbook = new XSSFWorkbook();
			var fontStyle = workbook.CreateFont();
			fontStyle.IsBold = true;

			var borderStyle = workbook.CreateCellStyle();
			borderStyle.BorderLeft = BorderStyle.Thin;
			borderStyle.BorderRight = BorderStyle.Thin;
			borderStyle.BorderTop = BorderStyle.Thin;
			borderStyle.BorderBottom = BorderStyle.Thin;


			ISheet sheet1 = workbook.CreateSheet("Sheet1");

			// Date and shift
			var rowIndex = 0;
			CreateRowAndSetValue(sheet1, rowIndex++, "Date", dateNow.ToString("dd-MMM-yy"), fontStyle);
			CreateRowAndSetValue(sheet1, rowIndex++, "Shift", shiftDisplay, fontStyle);

			// Table head
			rowIndex++;
			rowIndex++;
			string[] headers = { "Base\nLocation", "Company", "Role", "Demand", "Deployed", "Shortfall" };

			IRow row3 = sheet1.CreateRow(rowIndex);
			for (int i = 0; i < headers.Length; i++)
			{
				var headerCell = row3.CreateCell(i);
				headerCell.SetCellValue(headers[i]);
				headerCell.CellStyle = borderStyle;
			}

			foreach (var item in items)
			{
				rowIndex++;
				IRow rowItem = sheet1.CreateRow(rowIndex);

				void SetCellValueAndStyle(int columnIndex, string value)
				{
					var cell = rowItem.CreateCell(columnIndex);
					cell.SetCellValue(value);
					cell.CellStyle = borderStyle;
				}

				SetCellValueAndStyle(0, item.BaseLocation);
				SetCellValueAndStyle(1, item.Company);
				SetCellValueAndStyle(2, item.Role);
				SetCellValueAndStyle(3, item.Demand.ToString());
				SetCellValueAndStyle(4, item.Deployed.ToString());
				SetCellValueAndStyle(5, item.Shortfall.ToString());
			}

			using (var memoryStream = new MemoryStream())
			{
				workbook.Write(memoryStream);
				attachments.Add(new Attachments
				{
					FileName = newFile,
					Data = memoryStream.ToArray()
				});
			}
		}

		string formatDate = dateNow.ToString("MM/dd/yyyy");
		var emailbody = $@"
		<h3 style='text-transform: uppercase;2
		font-weight: bold;'>Whom to concern</h3>
		<p style='margin-bottom: 20px;'>This is automatically generated email for Manpower Summary Report Date {formatDate}</p>
		<p style='margin-bottom: 20px;'>If need more information, please contact xx-xxx-xxxx (24/7 or NBD)</p>";

		var emailList = await _uow.AttendanceRepository.GetConfigEmail();
		var ccEmail = await _uow.AttendanceRepository.GetConfigCCEmail();
		var bodymail = new MailRequest(emailList, "Time Attendance Report (Daily)", emailbody, attachments, ccEmail);
		await _msr.SendEmailAsync(bodymail);
		File.Delete(newFile);
		return new GetReportAttendantResult();
	}

	private static void CreateRowAndSetValue(ISheet sheet, int rowIndex, string value, string formattedValue, IFont fontStyle)
	{
		IRow row = sheet.CreateRow(rowIndex);
		var cell = row.CreateCell(0);
		cell.SetCellValue(value);
		cell.CellStyle = sheet.Workbook.CreateCellStyle();
		cell.CellStyle.SetFont(fontStyle);
		row.CreateCell(1).SetCellValue(formattedValue);
	}
}
