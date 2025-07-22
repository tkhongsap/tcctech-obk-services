using System;
using NPOI.SS.UserModel;
using NPOI.XSSF.UserModel;
using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Application.Helper.Service;
using TCCTOBK.OperationBackend.Domain;

namespace TCCTOBK.OperationBackend.Application.Features.Report.OperationOnboard.Query.OperationUserReport;

public class OperationUserReportHandler : IQueryHandler<OperationUserReportQuery, OperationUserReportResult>
{
	private readonly IUnitOfWork _uow;
	private readonly IClientSiteService _clientSiteService;

	public OperationUserReportHandler(IUnitOfWork uow, IClientSiteService clientSiteService)
	{
		_uow = uow;
		_clientSiteService = clientSiteService;
	}

	public async Task<OperationUserReportResult> Handle(OperationUserReportQuery request, CancellationToken cancellationToken)
	{
		var tenantIds = new List<Guid> { Constant.TENANT_OPERATION_APP_ID };
		var members = await _uow.MemberRepository.GetAllReport(null, new List<Guid>(), null, tenantIds, false);


		IWorkbook workbook = new XSSFWorkbook();
		var fontStyle = workbook.CreateFont();
		fontStyle.IsBold = true;

		var borderStyle = workbook.CreateCellStyle();
		borderStyle.BorderLeft = BorderStyle.Thin;
		borderStyle.BorderRight = BorderStyle.Thin;
		borderStyle.BorderTop = BorderStyle.Thin;
		borderStyle.BorderBottom = BorderStyle.Thin;

		ISheet sheet1 = workbook.CreateSheet("Sheet1");

		// Date
		var rowIndex = 0;
		CreateRowAndSetValue(sheet1, rowIndex++, "Date", DateTime.Now.ToString("dd-MMM-yy"), fontStyle);

		// Table head
		rowIndex++;
		rowIndex++;
		string[] headers = { "Member ID", "Email", "Name", "Roles", "isActive", "createdDate", "createdBy", "updatedDate", "updatedBy" };

		IRow rowHeader = sheet1.CreateRow(rowIndex);
		for (int i = 0; i < headers.Length; i++)
		{
			var headerCell = rowHeader.CreateCell(i);
			headerCell.SetCellValue(headers[i]);
			headerCell.CellStyle = borderStyle;
		}

		foreach (var item in members)
		{
			rowIndex++;
			IRow rowItem = sheet1.CreateRow(rowIndex);
			void SetCellValueAndStyle(int columnIndex, string value)
			{
				var cell = rowItem.CreateCell(columnIndex);
				cell.SetCellValue(value);
				cell.CellStyle = borderStyle;
			}

			var roles = String.Join(", ", item.trRoleMembers
																				.Where(x => x.trRole.CSID == _clientSiteService.ClientSiteId && x.trRole.TID == Constant.TENANT_OPERATION_APP_ID)
																				.Select(x => x.trRole.Name)
																				.ToArray());

			SetCellValueAndStyle(0, item.MID.ToString());
			SetCellValueAndStyle(1, item.Email);
			SetCellValueAndStyle(2, item.Name ?? "");
			SetCellValueAndStyle(3, roles);
			SetCellValueAndStyle(4, item.IsActive ? "True" : "False");
			SetCellValueAndStyle(5, item.CreatedDate.AddHours(7).ToString());
			SetCellValueAndStyle(6, item.CreatedByName ?? "");
			SetCellValueAndStyle(7, item.UpdatedDate.AddHours(7).ToString());
			SetCellValueAndStyle(8, item.UpdatedByName ?? "");

		}

		using (var memoryStream = new MemoryStream())
		{
			workbook.Write(memoryStream);
			return new OperationUserReportResult
			{
				ContentBytes = memoryStream.ToArray()
			};
		}
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
