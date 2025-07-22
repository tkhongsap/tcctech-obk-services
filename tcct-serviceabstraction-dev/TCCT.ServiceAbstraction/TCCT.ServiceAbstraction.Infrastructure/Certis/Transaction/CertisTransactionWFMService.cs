using Microsoft.AspNetCore.Http;
using TCCT.ServiceAbstraction.Application.Contracts.Certis;
using TCCT.ServiceAbstraction.Application.Contracts.Certis.Transaction;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.WFM.Command.StaffClockIn;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.WFM.Command.StaffClockOut;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.WFM.Query.DutyShifts;

namespace TCCT.ServiceAbstraction.Infrastructure.Certis.Transaction;
public class CertisTransactionWFMService : ICertisTransactionWFMService
{
	ICertisEndpointProvider _endpointprovider;
	ICertisMemoryCache _cache;

	public CertisTransactionWFMService(ICertisMemoryCache cache, ICertisEndpointProvider endpointProvider)
	{
		_endpointprovider = endpointProvider;
		_cache = cache;
	}

	public Task<StaffClockInResult> StaffClockIn(StaffClockInCommand data)
	{
		return _endpointprovider.StaffClockIn(data);
	}
	public Task<StaffClockOutResult> StaffClockOut(StaffClockOutCommand data)
	{
		return _endpointprovider.StaffClockOut(data);
	}
	public Task<List<DutyShiftsResult>> DutyShifts(DutyShiftsQuery data)
	{
		return _endpointprovider.DutyShifts(data);
	}
}
