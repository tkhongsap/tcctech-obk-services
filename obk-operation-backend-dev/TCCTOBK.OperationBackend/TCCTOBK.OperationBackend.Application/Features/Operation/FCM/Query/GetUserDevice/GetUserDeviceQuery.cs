using System;
using MediatR;
using TCCTOBK.OperationBackend.Application.Configuration.Queries;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.FCM.Query.GetUserDevice;

public record GetUserDeviceQuery(Guid id) : IQuery<List<GetUserDeviceResult>>;