// using System.Net;
// using MediatR;
// using Microsoft.AspNetCore.Mvc;
// using Swashbuckle.AspNetCore.Annotations;
// using TCCTOBK.OperationBackend.Api.Controllers;
// using TCCTOBK.OperationBackend.Application;
// using TCCTOBK.OperationBackend.Application.Features;

// namespace TCCTOBK.OperationBackend.Api;
// [ApiController]
// [Route("api/mobile/v1/WorkListSecurity")]
// [ApiExplorerSettings(GroupName = "operationv1")]
// public class WorkListSecurityController : OperationApiControllerBase
// {
//   private readonly IMediator _mediator;
//   public WorkListSecurityController(IMediator mediator)
//   {
//     _mediator = mediator;
//   }
//   [HttpGet("TodoList")]
//   [SwaggerOperation(Summary = "Get TodoList")]
//   [ProducesResponseType(typeof(GetTodoListResult), (int)HttpStatusCode.OK)]
//   [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
//   [ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
//   public async Task<IActionResult> TodoList([FromQuery] GetTodoListQuery data)
//   {
//     var res = await _mediator.Send(data);
//     return Ok(res);
//   }
//   [HttpGet("WorkListSecurityDetail")]
//   [SwaggerOperation(Summary = "Get WorkListSecurityDetail")]
//   [ProducesResponseType(typeof(GetWorkListSecurityDetailResult), (int)HttpStatusCode.OK)]
//   [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
//   [ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
//   public async Task<IActionResult> WorkListSecurityDetail([FromQuery] GetWorkListSecurityDetailQuery data)
//   {
//     var res = await _mediator.Send(data);
//     return Ok(res);
//   }
//   [HttpPut("SubmitWork")]
//   [SwaggerOperation(Summary = "SubmitWork")]
//   [ProducesResponseType(typeof(SubmitWorkResult), (int)HttpStatusCode.OK)]
//   [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
//   [ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
//   public async Task<IActionResult> SubmitWork([FromBody] SubmitWorkCommand data)
//   {
//     var res = await _mediator.Send(data);
//     return Ok(res);
//   }
//   [HttpGet("SubmitHistory")]
//   [SwaggerOperation(Summary = "SubmitHistory")]
//   [ProducesResponseType(typeof(SubmitWorkResult), (int)HttpStatusCode.OK)]
//   [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
//   [ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
//   public async Task<IActionResult> SubmitHistory([FromBody] SubmitWorkCommand data)
//   {
//     var res = await _mediator.Send(data);
//     return Ok(res);
//   }
//   [HttpPost("RejectWork")]
//   [SwaggerOperation(Summary = "RejectWork")]
//   [ProducesResponseType(typeof(RejectWorkResult), (int)HttpStatusCode.OK)]
//   [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
//   [ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
//   public async Task<IActionResult> RejectWork([FromBody] RejectWorkCommand data)
//   {
//     var res = await _mediator.Send(data);
//     return Ok(res);
//   }
//   [HttpPost("AcknowledgeWork")]
//   [SwaggerOperation(Summary = "AcknowledgeWork")]
//   [ProducesResponseType(typeof(AcknowledgeWorkResult), (int)HttpStatusCode.OK)]
//   [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
//   [ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
//   public async Task<IActionResult> AcknowledgeWork([FromBody] AcknowledgeWorkCommand data)
//   {
//     var res = await _mediator.Send(data);
//     return Ok(res);
//   }
// }
