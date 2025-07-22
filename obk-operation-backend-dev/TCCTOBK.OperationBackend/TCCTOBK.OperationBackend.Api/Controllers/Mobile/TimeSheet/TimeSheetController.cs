// using System.Net;
// using MediatR;
// using Microsoft.AspNetCore.Mvc;
// using Swashbuckle.AspNetCore.Annotations;
// using TCCTOBK.OperationBackend.Api.Controllers;
// using TCCTOBK.OperationBackend.Application;
// using TCCTOBK.OperationBackend.Application.Features;

// namespace TCCTOBK.OperationBackend.Api;
// [ApiController]
// [Route("api/mobile/v1/TimeSheet")]
// [ApiExplorerSettings(GroupName = "operationv1")]
// public class TimeSheetController : OperationApiControllerBase
// {
//   private readonly IMediator _mediator;

//   public TimeSheetController(IMediator mediator)
//   {
//     _mediator = mediator;
//   }

//   [HttpPost("StampTimeSheet")]
//   [SwaggerOperation(Summary = "Check in and check out today")]
//   [ProducesResponseType(typeof(StampTimeSheetResult), (int)HttpStatusCode.OK)]
//   [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
//   [ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
//   public async Task<IActionResult> StampTimeSheet([FromBody] StampTimeSheetCommand data)
//   {
//     var res = await _mediator.Send(data);
//     if (!res.IsSuccess)
//     {
//       //TODO : ทำ mobile api exception 
//       return BadRequest();
//     }
//     return Ok(res);
//   }

//   [HttpGet("Check")]
//   [SwaggerOperation(Summary = "Check time sheet today")]
//   [ProducesResponseType(typeof(CheckTimeSheetResult), (int)HttpStatusCode.OK)]
//   [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
//   [ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
//   public async Task<IActionResult> CheckTimeSheet([FromQuery] CheckTimeSheetQuery data)
//   {
//     var res = await _mediator.Send(data);
//     return Ok(res);
//   }
// }
