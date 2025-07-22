using System;
using TCCTOBK.OperationBackend.Domain.Entities;

namespace TCCTOBK.OperationBackend.Application.Features.Urgent.Query.ServiceRequest;

public class ServiceRequestResult
{
  public List<trServiceRequest> Data { get; set; } = new List<trServiceRequest>();
  public int Total { get; set; } = 0;
}
