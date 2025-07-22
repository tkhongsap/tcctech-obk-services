using SkiaSharp;
using System.Drawing;
using System.Reflection;

namespace TCCT.ServiceAbstraction.Infrastructure.CarparkPayment;
public class ReceiptDrawing
{
	private string _resouce = "TCCT.ServiceAbstraction.Infrastructure.CarparkPayment.Resources.";
	public string Company { get; set; } = null!;
	public string Address1 { get; set; } = null!;
	public string Address2 { get; set; } = null!;
	public string Address3 { get; set; } = null!;
	public string TerminalId { get; set; } = null!;
	public string TaxInvoiceId { get; set; } = null!;
	public string DateTime { get; set; } = null!;
	public string TaxNo { get; set; } = null!;
	public string BillDate { get; set; } = null!;
	public string UserId { get; set; } = null!;
	public string CarId { get; set; } = null!;
	public string TicketNo { get; set; } = null!;
	public string EntryTime { get; set; } = null!;
	public string ExitTime { get; set; } = null!;
	public string PaidTime { get; set; } = null!;
	public string ParkTime { get; set; } = null!;
	public string Stamp { get; set; } = null!;
	public string SubTotal { get; set; } = null!;
	public string Discount { get; set; } = null!;
	public string Total { get; set; } = null!;
	public string Vat { get; set; } = null!;
	public string TotalVat { get; set; } = null!;
	public string HeaderReceipt { get; set; } = null!;

	public SKTypeface GetTypeface(string fullFontName)
	{
		var assembly = Assembly.GetExecutingAssembly();
		using var stream = assembly.GetManifestResourceStream(_resouce + fullFontName);
		if (stream == null) return null;

		return SKTypeface.FromStream(stream);
	}
	public SKBitmap GetBitmap(string fullFontName)
	{
		var assembly = Assembly.GetExecutingAssembly();
		using var stream = assembly.GetManifestResourceStream(_resouce + fullFontName);
		if (stream == null) return null;

		return SKBitmap.Decode(stream);
	}

	public string GetReceiptBase64()
	{
		var fr = GetTypeface("OneBangkok-Regular.ttf");
		// var fb = GetTypeface("OneBangkok-Bold.ttf");
		// var logo = GetBitmap("obk-logo.png");

		var totalwidth = 1000;
		var totalheight = 1360;
		var tab = 80;
		var bitmap = new SKBitmap(totalwidth, totalheight);
		var companyxy = new Point(tab, 70);
		var rectaxxy = new Point(tab, 140);
		var addressxy = new Point(tab, 210);
		var receiptxy = new Point(tab, 380);
		var vatincludexy = new Point(tab, 1210);
		var thankyouxy = new Point(tab, 1240);

		var lineheight = 50;
		var addresslineheight = 52;

		// Create a canvas from the bitmap
		using (var canvas = new SKCanvas(bitmap))
		{
			var fontheader = new SKFont(fr, 38);
			var font = new SKFont(fr, 32);

			// Draw background
			canvas.Clear(SKColors.White);

			// // Draw logo
			// canvas.DrawBitmap(logo, (totalwidth - 130) / 2, 30);

			// // draw white background
			// canvas.DrawRect(whiteboxxy.X, whiteboxxy.Y, totalwidth - 20, totalheight - 90, new SKPaint() { Color = SKColors.White });

			#region Company Name
			using (var paint = new SKPaint())
			{
				paint.Color = SKColors.Black;
				paint.TextAlign = SKTextAlign.Center;
				canvas.DrawText(Company, bitmap.Width / 2, companyxy.Y, fontheader, paint);
			}
			#endregion
			
			#region Receipt / Tax Invoice (ABB)
			using (var paint = new SKPaint())
			{
				paint.Color = SKColors.Black;
				paint.TextAlign = SKTextAlign.Center;
				canvas.DrawText(HeaderReceipt, bitmap.Width / 2, rectaxxy.Y, fontheader, paint);
			}
			#endregion

			#region Addresss
			using (var paint = new SKPaint())
			{
				paint.Color = SKColors.Black;
				paint.TextAlign = SKTextAlign.Center;
				canvas.DrawText(Address1, bitmap.Width / 2, addressxy.Y + (addresslineheight * 0), fontheader, paint);
				canvas.DrawText(Address2, bitmap.Width / 2, addressxy.Y + (addresslineheight * 1), fontheader, paint);
				canvas.DrawText(Address3, bitmap.Width / 2, addressxy.Y + (addresslineheight * 2), fontheader, paint);
			}
			#endregion

			// #region Contact
			// using (var paint = new SKPaint())
			// {
			// 	paint.Color = SKColors.Black;
			// 	paint.TextAlign = SKTextAlign.Center;
			// 	canvas.DrawText(Contact, contactxy.X, contactxy.Y, font, paint);
			// }
			// #endregion

			#region Receipt
			using (var paint = new SKPaint())
			{
				paint.Color = SKColors.Black;
				paint.TextAlign = SKTextAlign.Left;
				canvas.DrawText("TAX ID", receiptxy.X, receiptxy.Y + (lineheight * 0), font, paint);
				canvas.DrawText("DATE/TIME", receiptxy.X, receiptxy.Y + (lineheight * 1), font, paint);
				canvas.DrawText("TAX INVOICE NO.", receiptxy.X, receiptxy.Y + (lineheight * 2), font, paint);
				canvas.DrawText("TERMINAL NAME.", receiptxy.X, receiptxy.Y + (lineheight * 3), font, paint);
				canvas.DrawText("USER ID.", receiptxy.X, receiptxy.Y + (lineheight * 4), font, paint);
				canvas.DrawText("CAR-ID.", receiptxy.X, receiptxy.Y + (lineheight * 5), font, paint);
				canvas.DrawText("TICKET NO.", receiptxy.X, receiptxy.Y + (lineheight * 6), font, paint);
				canvas.DrawText("ENTRY TIME.", receiptxy.X, receiptxy.Y + (lineheight * 7), font, paint);
				canvas.DrawText("EXIT TIME.", receiptxy.X, receiptxy.Y + (lineheight * 8), font, paint);
				canvas.DrawText("PARK TIME.", receiptxy.X, receiptxy.Y + (lineheight * 9), font, paint);
				canvas.DrawText("", receiptxy.X, receiptxy.Y + (lineheight * 10), font, paint);
				canvas.DrawText("SUBTOTAL (BAHT).", receiptxy.X, receiptxy.Y + (lineheight * 11), font, paint);
				canvas.DrawText("DISCOUNT (BAHT).", receiptxy.X, receiptxy.Y + (lineheight * 12), font, paint);
				canvas.DrawText("TOTAL (BAHT).", receiptxy.X, receiptxy.Y + (lineheight * 13), font, paint);
				canvas.DrawText("VAT 7% INCLUDE (BAHT).", receiptxy.X, receiptxy.Y + (lineheight * 14), font, paint);
				canvas.DrawText("TOTAL VAT INCLUDED (BAHT).", receiptxy.X, receiptxy.Y + (lineheight * 15), font, paint);
			}
			#endregion

			#region Receipt Value
			using (var paint = new SKPaint())
			{
				paint.Color = SKColors.Black;
				paint.TextAlign = SKTextAlign.Right;
				canvas.DrawText(TaxInvoiceId, bitmap.Width - tab, receiptxy.Y + (lineheight * 0), font, paint);
				canvas.DrawText(DateTime, bitmap.Width - tab, receiptxy.Y + (lineheight * 1), font, paint);
				canvas.DrawText(TaxNo, bitmap.Width - tab, receiptxy.Y + (lineheight * 2), font, paint);
				canvas.DrawText(TerminalId, bitmap.Width - tab, receiptxy.Y + (lineheight * 3), font, paint);
				canvas.DrawText(UserId, bitmap.Width - tab, receiptxy.Y + (lineheight * 4), font, paint);
				canvas.DrawText(CarId, bitmap.Width - tab, receiptxy.Y + (lineheight * 5), font, paint);
				canvas.DrawText(TicketNo, bitmap.Width - tab, receiptxy.Y + (lineheight * 6), font, paint);
				canvas.DrawText(EntryTime, bitmap.Width - tab, receiptxy.Y + (lineheight * 7), font, paint);
				canvas.DrawText(ExitTime, bitmap.Width - tab, receiptxy.Y + (lineheight * 8), font, paint);
				canvas.DrawText(ParkTime, bitmap.Width - tab, receiptxy.Y + (lineheight * 9), font, paint);
				canvas.DrawText("", bitmap.Width - tab, receiptxy.Y + (lineheight * 10), font, paint);
				canvas.DrawText(SubTotal, bitmap.Width - tab, receiptxy.Y + (lineheight * 11), font, paint);
				canvas.DrawText(Discount, bitmap.Width - tab, receiptxy.Y + (lineheight * 12), font, paint);
				canvas.DrawText(TotalVat, bitmap.Width - tab, receiptxy.Y + (lineheight * 13), font, paint);
				canvas.DrawText(Vat, bitmap.Width - tab, receiptxy.Y + (lineheight * 14), font, paint);
				canvas.DrawText(Total, bitmap.Width - tab, receiptxy.Y + (lineheight * 15), font, paint);
			}
			#endregion

			#region VAT INCLUDED
			using (var paint = new SKPaint())
			{
				paint.Color = SKColors.Black;
				paint.TextAlign = SKTextAlign.Center;
				canvas.DrawText("**VAT INCLUDED**", bitmap.Width / 2, vatincludexy.Y, font, paint);
			}
			#endregion

			// canvas.DrawLine(tab, thankyouxy.Y, bitmap.Width - tab, thankyouxy.Y, new SKPaint() { Color = SKColors.Black, StrokeWidth = 2 });

			// Create paint object with stroke settings
			using (var paint = new SKPaint())
			{
					paint.Style = SKPaintStyle.Stroke;
					paint.Color = SKColors.Black;
					paint.StrokeWidth = 5;
					
					// Set the dash pattern
					// Dash intervals: first is the length of the dash, second is the length of the gap, and so on
					paint.PathEffect = SKPathEffect.CreateDash(new float[] { 10, 5 }, 0);

					// Define the start and end points of the line
					var startPoint = new SKPoint(tab, thankyouxy.Y);
					var endPoint = new SKPoint(bitmap.Width - tab, thankyouxy.Y);

					// Draw the dashed line
					canvas.DrawLine(startPoint, endPoint, paint);
			}

			#region Thankyou
			using (var paint = new SKPaint())
			{
				paint.Color = SKColors.Black;
				paint.TextAlign = SKTextAlign.Center;
				canvas.DrawText("THANK YOU FOR PARKING", bitmap.Width / 2, thankyouxy.Y + 55, font, paint);
			}
			#endregion
		}

		// convet skbitmap to base64
		using (var image = SKImage.FromBitmap(bitmap))
		{
			using (var data = image.Encode(SKEncodedImageFormat.Png, 100))
			{
				var base64 = Convert.ToBase64String(data.ToArray());
				return "data:image/png;base64," + base64;
			}
		}

	}

}
