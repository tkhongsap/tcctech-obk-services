using System.Globalization;
using TCCT.ServiceAbstraction.Application.Configuration.Queries;
using TCCT.ServiceAbstraction.Application.Contracts.Certis;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.WFM.Query.DutyShifts;

public sealed class DutyShiftsQueryHandler : IQueryHandler<DutyShiftsQuery, List<DutyShiftsResult>>
{
	private readonly ICertisService _certisservice;
	public DutyShiftsQueryHandler(ICertisService certisservice)
	{
		_certisservice = certisservice;
	}

	public async Task<List<DutyShiftsResult>> Handle(DutyShiftsQuery request, CancellationToken cancellationToken)
	{
		return await _certisservice.Transaction.WFMService.DutyShifts(request);
	}
}



