using System;
using TCCTOBK.OperationBackend.Application.Configuration.Queries;

namespace TCCTOBK.OperationBackend.Application.Features.LBS.Wayfinding.Query.GetDefaultIcon;

public record GetDefaultIconQuery(string DefaultIcon) : IQuery<GetDefaultIconResult>;
