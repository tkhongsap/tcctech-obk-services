using MediatR;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using System.Net;
using TCCTOBK.OperationBackend.Application;
using TCCTOBK.OperationBackend.Application.Features;
using TCCTOBK.OperationBackend.Application.Features.Operation.OpApp;
using TCCTOBK.OperationBackend.Application.Features.Operation.OpApp.Command;

namespace TCCTOBK.OperationBackend.Api.Controllers.Operation.OpApp;

[ApiController]
[Route("api/operation/v1/Work")]
[ApiExplorerSettings(GroupName = "operationv1")]
public class OpAppController : OperationApiControllerBase
{
  private readonly IMediator _mediator;

  public OpAppController(IMediator mediator)
  {
    _mediator = mediator;
  }

  // [HttpPost("AttendWork")]
  // [SwaggerOperation(Summary = "Attend work")]
  // [ProducesResponseType(typeof(AttendWorkResult), (int)HttpStatusCode.OK)]
  // [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
  // [ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
  // public async Task<IActionResult> PostAttendWork([FromBody] string qrcode) // TODO: change to valid parameter later
  // {
  //   var command = new AttendWorkCommand();
  //   var res = await _mediator.Send(command);
  //   return Ok(res);
  // }

  [HttpPost("QRCODE/Generate")]
  [SwaggerOperation(Summary = "Generate QR Code")]
  [ProducesResponseType(typeof(GenerateQRCodeResult), (int)HttpStatusCode.OK)]
  [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
  [ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
  public async Task<IActionResult> GenerateQRCode([FromBody] GenerateQRCodeCommand data)
  {
    var res = await _mediator.Send(data);
    return Ok(res);
  }
  [HttpGet("QRCODE")]
  [SwaggerOperation(Summary = "Get QR Code List")]
  [ProducesResponseType(typeof(GetQRCodeResult), (int)HttpStatusCode.OK)]
  [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
  [ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
  public async Task<IActionResult> GetQRCodeList()
  {
    var query = new GetQRCodeQuery();
    var res = await _mediator.Send(query);
    return Ok(res);
  }

  // [HttpPost("QRScan/TimeCardEntries")]
  // [SwaggerOperation(Summary = "Check In,Check Out")]
  // [ProducesResponseType(typeof(string), (int)HttpStatusCode.OK)]
  // [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
  // [ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
  // public async Task<IActionResult> TimeCardEntries([FromBody] CheckTimeCommand data)
  // {
  //   // //check qrcode
  //   // var qrquery = new GetQRCODEScanQuery(data.CheckCode);
  //   // var qrres = await _mediator.Send(qrquery);
  //   // if (qrres == null)
  //   // {
  //   // 	return NotFound();
  //   // }
  //   // //check CheckTimeCardEntries
  //   // var query = new CheckTimeCardEntriesQuery(data.KCUsername, qrres.TSID!.Value);
  //   // var rescheck = await _mediator.Send(query);
  //   var command = new CheckTimeCommand(data.KCUsername, data.CheckCode);
  //   var res = await _mediator.Send(command);
  //   return Ok(res);
  // }
}
