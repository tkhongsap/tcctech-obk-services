using Microsoft.AspNetCore.Http;

namespace TCCTOBK.OperationBackend.Application;

public static class FromFileExtensions
{
	public static async Task<byte[]> GetBytesAsync(this IFormFile formFile)
	{
		await using var memoryStream = new MemoryStream();
		await formFile.CopyToAsync(memoryStream);
		return memoryStream.ToArray();
	}
}
