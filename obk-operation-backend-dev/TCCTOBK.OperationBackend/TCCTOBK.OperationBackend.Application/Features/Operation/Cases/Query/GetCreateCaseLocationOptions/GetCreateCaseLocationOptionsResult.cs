using System;
using TCCTOBK.OperationBackend.Application.Features.Operation.Cases.Query.GetCreateCaseForm;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.Cases.Query.GetCreateCaseLocationOptions;

public class GetCreateCaseLocationOptionsResult
{
  public List<DropdownData> Location { get; set; } = new List<DropdownData>();
}
