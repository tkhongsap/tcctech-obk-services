using System;

namespace TCCTOBK.OperationBackend.Application.Features.Mobile.CWO.Query.OptionsCWO;

public class OptionsCWOResult
{
  public List<DropDownOption> Location { get; set; } = new List<DropDownOption>();
  public List<DropDownOption> CWOType { get; set; } = new List<DropDownOption>();
  public List<DropDownOption> ProblemType { get; set; } = new List<DropDownOption>();
  public List<DropDownOption> ServiceCategory { get; set; } = new List<DropDownOption>();
  public List<DropDownOption> Priority { get; set; } = new List<DropDownOption>();
  public List<DropDownOption> Asset { get; set; } = new List<DropDownOption>();
  public List<DropDownOption> Requester { get; set; } = new List<DropDownOption>();
}

public class DropDownOption()
{
  public int Value { get; set; }
  public string Text { get; set; } = default!;
}