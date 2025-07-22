using System.Net;

namespace TCCTOBK.OperationBackend.Api;
public class SuccessResponse<T>
{
	public int Code { get; set; } = (int)HttpStatusCode.OK;
	public T? Data { get; set; }

	public SuccessResponse() { }

	public SuccessResponse(int code, T? data)
	{
		Code = code;
		Data = data;
	}

	public SuccessResponse(T? data)
	{
		Data = data;
	}
}
