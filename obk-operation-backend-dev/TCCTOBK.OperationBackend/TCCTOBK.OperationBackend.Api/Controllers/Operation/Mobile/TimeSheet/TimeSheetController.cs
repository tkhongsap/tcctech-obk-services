using MediatR;
using Microsoft.AspNetCore.Mvc;
using TCCTOBK.OperationBackend.Api.Controllers;

namespace TCCTOBK.OperationBackend.Api;
[ApiController]
[Route("api/v1/operation/mobile/timesheet")]
[ApiExplorerSettings(GroupName = "operationmobilev1")]
public class TimeSheetController : OperationApiControllerBase
{
  private readonly IMediator _mediator;

  public TimeSheetController(IMediator mediator)
  {
    _mediator = mediator;
  }
}
