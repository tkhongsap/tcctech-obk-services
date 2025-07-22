// using System.Net;
// using MediatR;
// using Microsoft.AspNetCore.Mvc;
// using Swashbuckle.AspNetCore.Annotations;
// using TCCTOBK.OperationBackend.Api.Controllers;
// using TCCTOBK.OperationBackend.Application.Features;

// namespace TCCTOBK.OperationBackend.Api;
// [ApiController]
// [Route("api/mobile/v1/masterdata")]
// [ApiExplorerSettings(GroupName = "operationv1")]
// public class SOCController : OperationApiControllerBase
// {
//   private readonly IMediator _mediator;

//   public SOCController(IMediator mediator)
//   {
//     _mediator = mediator;
//   }

//   [HttpPost("CaseIncident")]
//   [SwaggerOperation(Summary = "Create Incident")]
//   [ProducesResponseType(typeof(string), (int)HttpStatusCode.OK)]
//   [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
//   [ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
//   public async Task<IActionResult> CreateIncident([FromBody] string command)
//   {
//     var res = await _mediator.Send(command);
//     return Ok(res);
//   }
// }


