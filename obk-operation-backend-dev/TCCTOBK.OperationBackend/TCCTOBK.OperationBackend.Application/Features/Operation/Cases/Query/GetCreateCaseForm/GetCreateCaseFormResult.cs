using System;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.Cases.Query.GetCreateCaseForm;

public class GetCreateCaseFormResult
{
  public List<DropdownData> EventType { get; set; } = new List<DropdownData>();
  public List<DropdownData> Location { get; set; } = new List<DropdownData>();
}

public class DropdownData
{
  public string Text { get; set; } = "-";
  public int Value { get; set; }
}
