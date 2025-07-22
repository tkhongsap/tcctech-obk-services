using System;
using Microsoft.AspNetCore.Http;
using TCCTOBK.OperationBackend.Application.Configuration.Commands;

namespace TCCTOBK.OperationBackend.Application.Features.Urgent.Command.ServiceRequest.upload;

public class UploadCommand : ICommand<UploadResult>
{
	public IFormFile File { get; set; } = default!;
	public string FileName { get; set; } = default!;
}
