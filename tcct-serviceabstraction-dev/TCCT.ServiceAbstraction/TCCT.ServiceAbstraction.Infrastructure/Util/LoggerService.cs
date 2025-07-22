using Microsoft.Extensions.Logging;
public static class LoggerService
{
    public static void LogRequestAndResponse<T>(
        ILogger<T> logger,
        HttpResponseMessage httpRes,
        string responseBody)
    {
        try
        {
            var requestThirdParty = httpRes.RequestMessage?.Content != null
                ? httpRes.RequestMessage.Content.ReadAsStringAsync().Result
                : "";

            logger.LogInformation("[Request-infra] Method: {Method}, URL: {Url}, Headers: {Headers}, Body: {RequestBody}",
                httpRes.RequestMessage?.Method,
                httpRes.RequestMessage?.RequestUri,
                httpRes.RequestMessage?.Headers,
                requestThirdParty
            );

            responseBody = "";

            logger.LogInformation("[Response-infra] Status Code: {StatusCode}, Headers: {Headers}, Body: {ResponseBody}",
                httpRes.StatusCode,
                httpRes.Headers,
                responseBody
            );
        }
        catch (Exception ex)
        {
            logger.LogError("[Logging-Error] Failed to log request/response: {ErrorMessage}", ex.Message);
        }
    }
}