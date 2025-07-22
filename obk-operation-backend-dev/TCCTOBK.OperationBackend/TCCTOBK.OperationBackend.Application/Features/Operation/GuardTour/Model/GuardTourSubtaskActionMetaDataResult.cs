using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading.Tasks;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Model;
public class GuardTourSubtaskActionMetaDataResult
{
	public List<string>? Photos { get; set; }
	public List<string>? Videos { get; set; }
	public List<string>? Files { get; set; }
	public List<GuardTourSubtaskActionMetaDataBase64>? PhotoList { get; set; }
}


public class GuardTourSubtaskActionMetaDataBase64
{
	public string? Base64 { get; set;}
	public string? Date { get; set;}
	public string? Path { get; set;}
}
