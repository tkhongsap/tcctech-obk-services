using System.Globalization;
using TCCT.ServiceAbstraction.Application.Configuration.Queries;
using TCCT.ServiceAbstraction.Application.Contracts.ServiceMindResidential;

namespace TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Query.GetHome;

public sealed class GetHomeQueryHandler : IQueryHandler<GetHomeQuery, GetHomeResult>
{
	private readonly IServiceMindResidential _service;
	public GetHomeQueryHandler(IServiceMindResidential service)
	{
		_service = service;
	}

	public async Task<GetHomeResult> Handle(GetHomeQuery request, CancellationToken cancellationToken)
	{
		var res = await _service.GetHome(request);
		GetHomeResult response = new GetHomeResult
		{
			tenantId = request.TenantId,
			anouncement = new AnnouncementSection
			{
				contents = res.announcements
					.Where(x => request.ProjectId == null || x.projects.Any(p => p.projectId == request.ProjectId))
					.Select(x => new Announcement
					{
						id = x.id,
						title = x.title,
						description = x.description,
						imageUrl = x.imageUrl,
						announcementDate = x.announcementDate,
						pinnedToHome = x.pinnedToHome,
						pinnedToHomeEndDate = x.pinnedToHomeEndDate
					}).ToList()
			},
			quickAction = res.quickActions.Select(x => new QuickActionSection
			{
				icon = x.icon,
				title = request.Lang == "th" && x.title!.th != null ? x.title!.th : request.Lang == "cn" && x.title!.cn != null? x.title!.cn : x.title!.en,
				url = x.data!.url,
				action = x.data!.action
			}).ToList(),
			reminder = new ReminderSection
			{
				visitor = res.reminder.visitor,
				parcel = res.reminder.parcel
			},
			services = res.services
			.Where(x => request.ProjectId == null || x.projects.Any(p => p.projectId == request.ProjectId))
			.Select(x => new ServiceSection
			{
				name = request.Lang == "th" && x.name!.th != null ? x.name!.th : request.Lang == "cn" && x.name!.cn != null ? x.name!.cn: x.name!.en,
				type = x.type,
				data = x.data,
				chatAvatar = x.chatAvatar
			}).ToList()
		};
		return response;
	}

	private string GetDateTimeString(string lang, string unixTime)
	{
		var dateTime = DateTimeOffset.FromUnixTimeMilliseconds(long.Parse(unixTime)).AddHours(7);
		var provider = CultureInfo.GetCultureInfo("th-TH");
		return lang == "th"
			? dateTime.ToString("dd MMMM yyyy \\เวลา\\ HH:mm", provider)
			: dateTime.ToString("dd MMMM yyyy \\a\\t HH:mm");
	}
}



