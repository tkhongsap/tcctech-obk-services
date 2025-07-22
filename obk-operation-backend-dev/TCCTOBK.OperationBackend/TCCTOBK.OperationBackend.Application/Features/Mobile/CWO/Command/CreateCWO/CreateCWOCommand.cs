using System;
using MediatR;

namespace TCCTOBK.OperationBackend.Application.Features.Mobile.CWO.Command.CreateCWO;

public class CreateCWOCommand : IRequest<CreateCWOResult>
{
  public DateTime requestedOn { get; set; }
  public int priorityId { get; set; }
  public int requesterId { get; set; }
  public int locationId { get; set; }
  public int assetId { get; set; }
  public int cwoTypeId { get; set; }
  public int serviceCategoryId { get; set; }
  public int problemTypeId { get; set; }
  public Guid createdBy { get; set; }
  public string description { get; set; } = default!;
  public Guid assignTo { get; set; }
}
