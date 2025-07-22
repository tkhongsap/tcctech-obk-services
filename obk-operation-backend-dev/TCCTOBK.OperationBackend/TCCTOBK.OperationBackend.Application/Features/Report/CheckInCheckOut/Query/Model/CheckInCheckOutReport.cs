using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TCCTOBK.OperationBackend.Application.Features.Report.CheckInCheckOut.Query.Model;
internal class CheckInCheckOutReport
{
	public string Date { get; set; } = "";
	public string Shift { get; set; } = "";
	public string UserId { get; set; } = "";
	public string FirstName { get; set; } = "";
	public string LastName { get; set; } = "";
	public string Company { get; set; } = "";
	public string Role { get; set; } = "";
	public string BaseLocation { get; set; } = "";
	public string? CheckInDateTime { get; set; }
	public string? CheckOutDateTime { get; set; }
	public string LateTime { get; set; } = "";
}
