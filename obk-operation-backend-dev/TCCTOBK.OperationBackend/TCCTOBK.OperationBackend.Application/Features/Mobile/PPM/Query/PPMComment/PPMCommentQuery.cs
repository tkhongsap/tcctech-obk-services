using System;
using TCCTOBK.OperationBackend.Application.Configuration.Queries;

namespace TCCTOBK.OperationBackend.Application.Features.Mobile.PPM.Query.PPMComment;

public class PPMCommentQuery : IQuery<List<PPMCommentResult>>
{
  public int PPMID { get; set; }

  public PPMCommentQuery(int pPMID)
  {
    PPMID = pPMID;
  }
}
