using System;
using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Domain;

namespace TCCTOBK.OperationBackend.Application.Features.Mobile.MasterData.Query.Staff;

public class GetStaffByEmailQuery : IQuery<List<GetStaffByEmailResult>>
{
    public string? Search { get; set; }
}
