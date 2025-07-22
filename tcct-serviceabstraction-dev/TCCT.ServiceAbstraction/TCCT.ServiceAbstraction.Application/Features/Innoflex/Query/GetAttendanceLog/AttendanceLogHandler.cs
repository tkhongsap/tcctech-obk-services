using TCCT.ServiceAbstraction.Application.Configuration.Queries;
using TCCT.ServiceAbstraction.Application.Contracts.Innoflex;
namespace TCCT.ServiceAbstraction.Application.Features.Innoflex.Query.GetAttendanceLog;
public class AttendanceLogHandler : IQueryHandler<AttendanceLogQuery, AttendanceLogResult>
{
	private readonly IInnoflexService _innoflexService;
	public AttendanceLogHandler(IInnoflexService innoflexService)
	{
		_innoflexService = innoflexService;
	}
	public async Task<AttendanceLogResult> Handle(AttendanceLogQuery request, CancellationToken cancellationToken)
	{
		return await _innoflexService.GetAttendanceLog(request);
	}
}
