using System;
using Microsoft.AspNetCore.Http;
using TCCTOBK.OperationBackend.Application.Configuration.Commands;

namespace TCCTOBK.OperationBackend.Application.Features.LBS.Wayfinding.Command.UploadDefaultIcon;

public class UploadDefaultIconCommand : ICommand<UploadDefaultIconResult>
{
	public IFormFile File { get; set; } = default!;
	public string FileName { get; set; } = default!;
}
