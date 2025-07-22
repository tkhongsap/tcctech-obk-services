using System;
using TCCT.ServiceAbstraction.Application.Configuration.Queries;

namespace TCCT.ServiceAbstraction.Application.Features.FinedayResidence.Redemption.GetDataRateCodeListByTenantID;

public class GetDataRateCodeListByTenantIDQuery : IQuery<List<GetDataRateCodeListByTenantIDResult>>
{
    public int tenantID { get; set; }
    public int memberType { get; set; }
    public int vehicleType { get; set; }
    public int departmentID { get; set; }
}
