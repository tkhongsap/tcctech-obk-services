using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TCCTOBK.OperationBackend.Application.Features.Report.Attendant.Query.Model;
internal class AttendantReport
{
	public string BaseLocation { get; set; } = "";
	public string Company { get; set; } = "";
	public string Role { get; set; } = "";
	public int Demand { get; set; } = 0;
	public int Deployed { get; set; } = 0;
	public int Shortfall { get; set; } = 0;
}
