using System;
using Amazon.Runtime.Internal;
using MediatR;
using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Domain;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Query.GetSocMember;

public class GetSocMemberQuery : IRequest<GetSocMemberResult>
{
}
