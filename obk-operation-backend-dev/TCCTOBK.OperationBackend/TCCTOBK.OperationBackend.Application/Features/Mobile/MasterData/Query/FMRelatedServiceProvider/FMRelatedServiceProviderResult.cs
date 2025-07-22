using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TCCTOBK.OperationBackend.Application.Features.Mobile.MasterData.Query.FMRelatedServiceProvider;
public class FMRelatedServiceProviderResult
{
	public int Id { get; set; }
	public string Name { get; set; }
	public string Description { get; set; }
	public string Phone { get; set; }
	public string Email { get; set; }
	public string Address { get; set; }
	public string CreatedBy { get; set; }
	public DateTime CreatedOn { get; set; }
	public string ModifiedBy { get; set; }
	public DateTime ModifiedOn { get; set; }
}
