using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Features.Marcom.Query.GetMainContent;

namespace TCCTOBK.OperationBackend.Application.Features.Marcom.Query.GetWhatHappenAll;
public class GetWhatHappenAllQuery : IQuery<WhatHappenAllResult>
{
    public GetContent Param { get; set; }
    public GetWhatHappenAllQuery(GetContent param)
    {
        Param = param;
    }
}
