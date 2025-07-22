using System;
using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Contracts.API;

namespace TCCTOBK.OperationBackend.Application.Features.Mobile.PPM.Query.PPMComment;

public class PPMCommentHandler : IQueryHandler<PPMCommentQuery, List<PPMCommentResult>>
{
  private readonly IAbstractionService _apiService;

  public PPMCommentHandler(IAbstractionService apiService)
  {
    _apiService = apiService;
  }

  public async Task<List<PPMCommentResult>> Handle(PPMCommentQuery request, CancellationToken cancellationToken)
  {
    var data = await _apiService.CertisTransaction.GetPPMComment(request.PPMID);
    var res = data.Select(x => new PPMCommentResult()
    {
      id = x.id,
      commentTypeId = x.commentTypeId,
      woId = x.woId,
      comment = x.comment,
      createdOn = x.createdOn,
      createdBy = x.createdBy,
      createdDate = x.createdOn?.AddHours(7).ToString("dd MMM yyyy h:mm:sstt") ?? "-"
    }).ToList();
    res = res.OrderByDescending(x => x.createdOn).ToList();
    return res;
  }
}
