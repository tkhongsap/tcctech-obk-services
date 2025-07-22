using System.Net;
using TCCTOBK.OperationBackend.Application;
using TCCTOBK.OperationBackend.Application.Exceptions;

namespace TCCTOBK.OperationBackend.Api;

public class ExceptionMiddleware
{
	private readonly RequestDelegate _next;

	public ExceptionMiddleware(RequestDelegate next)
	{
		_next = next;
	}

	public async Task Invoke(HttpContext context)
	{
		try
		{
			await _next(context);
		}
		catch (Exception ex)
		{
			await HandleExceptionAsync(context, ex);
		}
	}

	private async Task HandleExceptionAsync(HttpContext context, Exception exception)
	{
		ErrorReponse response = exception switch
		{
			ExceptionHandler _ => new ErrorReponse((int)HttpStatusCode.BadRequest, exception.Message),
			NotFoundException _ => new ErrorReponse((int)HttpStatusCode.NotFound, exception.Message),
			BadRequestException _ => new ErrorReponse((int)HttpStatusCode.BadRequest, exception.Message),
			// _ => new ErrorReponse((int)HttpStatusCode.InternalServerError, "เกิดข้อผิดพลาด"),

		};

		context.Response.ContentType = "application/json";
		context.Response.StatusCode = response.Code;
		await context.Response.WriteAsJsonAsync(response);
	}
}
