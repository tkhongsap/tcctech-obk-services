using MediatR;
using Refit;

namespace TCCTOBK.OperationBackend.Application;

public class SubmitWorkSecurityCommand : IRequest<SubmitWorkSecurityResult>
{
  public int WorkId { get; set; } = default!;
  public string TechniciansId { get; set; } = default!;
  public string WorkType { get; set; } = default!;
  public string Remark { get; set; } = default!;
  public string Reading { get; set; } = default!;
  public List<Attatchment>? Attatchment { get; set; } = new();
  public SubmitWorkSecurityCommand(int workid, string techniciansid, List<Attatchment> attatchment)
  {
    WorkId = workid;
    TechniciansId = techniciansid;
    Attatchment = attatchment;
  }
}

//public class Attatchment
//{
//  public int objectKey { get; set; }
//  public string? objectType { get; set; }
//  public string? description { get; set; }
//  public string? searchTags { get; set; }
//  public string? attachmentType { get; set; }
//  public string? isDefault { get; set; }
//  public string? isHidden { get; set; }
//  public ByteArrayPart bytes { get; set; }
//}
