using System;
using MediatR;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.Cases.Query.GetCreateCaseLocationOptions;

public class GetCreateCaseLocationOptionsQuery : IRequest<GetCreateCaseLocationOptionsResult>
{
  public int? Id { get; set; }
  public int? TypeId { get; set; }

  public GetCreateCaseLocationOptionsQuery(int? id, int? typeid)
  {
    Id = id;
    TypeId = typeid;
  }
}
