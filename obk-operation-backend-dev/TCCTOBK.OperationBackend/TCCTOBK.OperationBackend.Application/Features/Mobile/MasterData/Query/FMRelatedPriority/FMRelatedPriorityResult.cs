using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TCCTOBK.OperationBackend.Application.Features.Mobile.MasterData.Query.FMRelatedPriority;
public class FMRelatedPriorityResult
{
	public int Id { get; set; }
	public string Name { get; set; }
	public string ColorCode { get; set; }
	public bool IsCritical { get; set; }
}
