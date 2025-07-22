using System.Diagnostics;
using System.Text;

namespace TCCT.ServiceAbstraction.Api.Middleware;

public class LoggingMiddleware
{
	private readonly RequestDelegate _next;
	private readonly ILogger<LoggingMiddleware> _logger;

	public LoggingMiddleware(RequestDelegate next, ILogger<LoggingMiddleware> logger)
	{
		_next = next;
		_logger = logger;
	}

	public async Task Invoke(HttpContext context)
	{
		var stopwatch = Stopwatch.StartNew();
		await LogRequest(context);

		var originalResponseBody = context.Response.Body;

		using (var responseBody = new MemoryStream())
		{
			context.Response.Body = responseBody;
			await _next.Invoke(context);
			stopwatch.Stop();
			await LogResponse(context, responseBody, originalResponseBody, stopwatch.ElapsedMilliseconds);
		}
	}
	private async Task LogRequest(HttpContext context)
	{
		try
		{

			context.Request.EnableBuffering();

			var headers = context.Request.Headers.ToDictionary(
				h => h.Key,
				h => h.Value.ToString()
			);

			var requestReader = new StreamReader(context.Request.Body, Encoding.UTF8, leaveOpen: true);
			var body = await requestReader.ReadToEndAsync();
			context.Request.Body.Position = 0; 

			_logger.LogInformation("[Request] {Method} {Path} {ResponseTime} {Headers} {Body}",
				context.Request.Method,
				context.Request.Path + context.Request.QueryString,
				DateTime.UtcNow,
				headers,
				string.IsNullOrWhiteSpace(body) ? "" : body);

		}
		catch (Exception ex)
		{
			_logger.LogError(ex, "Error logging request");
		}
	}

	private async Task LogResponse(HttpContext context, MemoryStream responseBody, Stream originalResponseBody, long elapsedMs)
	{
		try
		{
			var headers = context.Response.Headers.ToDictionary(
				h => h.Key,
				h => h.Value.ToString()
			);

			responseBody.Seek(0, SeekOrigin.Begin);
			var body = await new StreamReader(responseBody, Encoding.UTF8).ReadToEndAsync();
			responseBody.Seek(0, SeekOrigin.Begin);


			await responseBody.CopyToAsync(originalResponseBody);
			context.Response.Body = originalResponseBody;

			_logger.LogInformation("[Response] {StatusCode} {ResponseTime} {ElapsedMs} {Header} {Body}",
				context.Response.StatusCode,
				DateTime.UtcNow,
				elapsedMs,
				headers,
				string.IsNullOrWhiteSpace(body) ? "" : body);

		}
		catch (Exception ex)
		{
			_logger.LogError(ex, "Error logging response");
		}
	}
}
