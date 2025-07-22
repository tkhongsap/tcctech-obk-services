using System;
using TCCTOBK.OperationBackend.Application.Configuration.Queries;

namespace TCCTOBK.OperationBackend.Application.Features.Mobile.PPM.Query.PPMTransection;

public class PPMTransectionQuery : IQuery<List<PPMTransectionResult>>
{
  public int PPMID { get; set; }

  public PPMTransectionQuery(int pPMID)
  {
    PPMID = pPMID;
  }
}
