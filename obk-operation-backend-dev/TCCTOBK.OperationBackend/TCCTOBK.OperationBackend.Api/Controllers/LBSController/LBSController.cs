using System.Net;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using TCCTOBK.OperationBackend.Application.Features;
using TCCTOBK.OperationBackend.Application.Features.LBS.Wayfinding.Command.UploadDefaultIcon;
using TCCTOBK.OperationBackend.Application.Features.LBS.Wayfinding.Query.GetBeaconByUUID;
using TCCTOBK.OperationBackend.Application.Features.LBS.Wayfinding.Query.GetBeaconsList;
using TCCTOBK.OperationBackend.Application.Features.LBS.Wayfinding.Query.GetDefaultIcon;

namespace TCCTOBK.OperationBackend.Api.Controllers.LBSController;

[ApiController]
[Route("api/v1/[controller]")]
[ApiExplorerSettings(GroupName = "lbsv1")]
public class LBSController : OperationApiControllerBase
{
    private readonly IMediator _mediator;

    public LBSController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet("GetDefaultIcon/{defaultIcon}")]
    [SwaggerOperation(Summary = "Get default icon by ")]
    [ProducesResponseType(typeof(byte[]), (int)HttpStatusCode.OK)]
    [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
    public async Task<ActionResult> GetDefaultIcon(string defaultIcon)
    {
        var query = new GetDefaultIconQuery(defaultIcon);
        var res = await _mediator.Send(query);
        return File(res.Content, res.ContentType);
    }

    [HttpPost("UploadDefaultIcon")]
    [SwaggerOperation(Summary = "Get default icon by filter")]
    [ProducesResponseType(typeof(byte[]), (int)HttpStatusCode.OK)]
    [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
    public async Task<ActionResult> GetDefaultIcon([FromForm] UploadDefaultIconCommand command)
    {
        var result = await _mediator.Send(command);
        return Ok(result);
    }

    [HttpGet("GetBeacons")]
    [SwaggerOperation(Summary = "Get list beacon")]
    [ProducesResponseType(typeof(byte[]), (int)HttpStatusCode.OK)]
    [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
    public async Task<ActionResult> GetListBeacon()
    {
        var query = new GetBeaconsListQuery();
        var res = await _mediator.Send(query);
        return Ok(res);
    }

    [HttpGet("GetBeaconByUUID/{UUID}")]
    [SwaggerOperation(Summary = "Get list beacon")]
    [ProducesResponseType(typeof(byte[]), (int)HttpStatusCode.OK)]
    [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
    public async Task<ActionResult> GetListBeaconByUUID(string uuid)
    {
        var query = new GetBeaconByUUIDQuery(uuid);
        var res = await _mediator.Send(query);
        return Ok(res);
    }

    [HttpGet("GetBoundaryOBK")]
    [SwaggerOperation(Summary = "Get boundary obk")]
    [ProducesResponseType(typeof(double[,]), (int)HttpStatusCode.OK)]
    [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
    public ActionResult GetBoundaryOBK()
    {
        double[,] boundary = {{13.72909856189798, 100.54501255075151}, // ติดถนนวิทยุุกับซอยอรุณมักกินนอน
                            {13.726807446528612, 100.54456806437604}, // ถนนวิทยุ หน้า starbuck reserved
                            {13.725962982421393, 100.5449491365431 }, // Mrt lumpini exit3
                            {13.724461651706752, 100.5487586006197 }, //มุมถนน พระราม4 ซอยปลูกจิต
                            {13.727419115439032, 100.548818963183  }, // มุมForum CUP
                            {13.727360157584936, 100.54957760644108}, // มุม CUP
                            {13.728531942228718, 100.54944484386027}, // มุมลานจอดรถ CUP
                            {13.72877579094898, 100.54764055998685 }};// มุม Forum
        return Ok(new { Polygon = ConvertToJaggedArray(boundary) });
    }

    private T[][] ConvertToJaggedArray<T>(T[,] multiArray)
    {
        int numOfColumns = multiArray.GetLength(0);
        int numOfRows = multiArray.GetLength(1);
        T[][] jaggedArray = new T[numOfColumns][];

        for (int c = 0; c < numOfColumns; c++)
        {
            jaggedArray[c] = new T[numOfRows];
            for (int r = 0; r < numOfRows; r++)
            {
                jaggedArray[c][r] = multiArray[c, r];
            }
        }

        return jaggedArray;
    }
}