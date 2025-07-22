using System;
using Microsoft.AspNetCore.Http;
using TCCTOBK.OperationBackend.Application.Configuration.Commands;

namespace TCCTOBK.OperationBackend.Application.Features.Urgent.Command.ServiceRequest.UploadMultiple;

public class UploadMultipleCommand : ICommand<List<string>>
{
    public List<UploadRequestImage> Images { get; set; } = new List<UploadRequestImage>();
}


public class UploadRequestImage
{
    public string FileName { get; set; }
    public string Base64Data { get; set; }
}
