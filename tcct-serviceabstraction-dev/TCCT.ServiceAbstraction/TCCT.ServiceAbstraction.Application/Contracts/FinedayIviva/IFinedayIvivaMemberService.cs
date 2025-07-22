using TCCT.ServiceAbstraction.Application.Features.FinedayIviva.Member.GetDataMember;
using TCCT.ServiceAbstraction.Application.Features.FinedayIviva.Member.GetDataMemberCarPark;

namespace TCCT.ServiceAbstraction.Application.Contracts.FinedayIviva;
public interface IFinedayIvivaMemberService
{
	Task<GetDataMemberResult> GetDataMember(int page, int perpage, string? search, string? startDate, string? endDate, bool active);
	Task<GetDataMemberCarParkResult> GetDataMemberCarPark(int page, int perpage, string? search, string? startDate, string? endDate, bool active);
}
