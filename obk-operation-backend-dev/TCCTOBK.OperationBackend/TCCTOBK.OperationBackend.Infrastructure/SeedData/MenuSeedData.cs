using TCCTOBK.OperationBackend.Domain.Entities;
using TCCTOBK.OperationBackend.Infrastructure.SeedData.Menu;

namespace TCCTOBK.OperationBackend.Infrastructure.SeedData;
public static class MenuSeedData
{
	public static List<mtMenu> Data = new List<mtMenu>
    {	
		// User
		UserMenu.Group,
        UserMenu.UserGroup,
        UserMenu.UserAll,

		// Marcom
		MarcomMenu.Group,
        MarcomMenu.MarcomGroup,
        MarcomMenu.HeroBanner,
        MarcomMenu.HeroBannerCreate,
        MarcomMenu.HeroBannerEdit,
        MarcomMenu.WhatHappening,
        MarcomMenu.WhatHappeningShow,
        MarcomMenu.WhatHappeningCreate,
        MarcomMenu.WhatHappeningEdit,
        MarcomMenu.ExploreOneBangkok,
        MarcomMenu.ExploreOneBangkokCreate,
        MarcomMenu.ExploreOneBangkokEdit,
        MarcomMenu.SpecialEvent,
        MarcomMenu.SpecialEventCreate,
        MarcomMenu.SpecialEventEdit,

		// Office
		OfficeMenu.Group,
        OfficeMenu.OfficeGroup,
        OfficeMenu.EditContent,
        OfficeMenu.WhatHappening,
        OfficeMenu.WhatHappeningCreate,
        OfficeMenu.WhatHappeningEdit,
        OfficeMenu.WhatHappeningShow,
        OfficeMenu.VersionHistory,
        OfficeMenu.VersionHistoryShow,
        OfficeMenu.DirectoryContact,
        OfficeMenu.DirectoryContactShow,
        OfficeMenu.DirectoryContactCreate,
        OfficeMenu.DirectoryContactEdit,
        OfficeMenu.EmergencyContact,

		// Notification
		NotificationMenu.Group,
        NotificationMenu.NotificationGroup,
        NotificationMenu.InApp,
        NotificationMenu.InAppShow,
        NotificationMenu.InAppCreate,
        NotificationMenu.InAppDuplicate,
        NotificationMenu.InAppAnnouncementDuplicate,
        NotificationMenu.InAppAnnouncement,
        NotificationMenu.InAppCreateTemplate,
        NotificationMenu.InAnnouncementCreateTemplate,
        NotificationMenu.InAppEdit,
        NotificationMenu.AnnouncementEdit,
        NotificationMenu.Draft,
        NotificationMenu.Template,
        NotificationMenu.TemplateShow,
        NotificationMenu.TemplateCreate,
        NotificationMenu.TemaplateAnnouncement,
        NotificationMenu.TemplateCreateFromCampaign,
        NotificationMenu.TemaplateAnnouncementFromCampaign,
        NotificationMenu.TemplateEdit,
        NotificationMenu.TemplateAnnouncementEdit,
        NotificationMenu.Category,
        NotificationMenu.CategoryShow,
        NotificationMenu.CategoryCreate,
        NotificationMenu.CategoryEdit,

		// Announcement
		// AnnouncementMenu.Group,
		// AnnouncementMenu.AnnouncementGroup,
		// AnnouncementMenu.Announcements,
		// AnnouncementMenu.AnnouncementCreate,
		// AnnouncementMenu.AnnouncementEdit,
		// AnnouncementMenu.InAnnouncementCreateTemplate,
		// AnnouncementMenu.InAppAnnouncementDuplicate,
		// AnnouncementMenu.Draft,
		// AnnouncementMenu.Template,
		// AnnouncementMenu.TemaplateAnnouncement,
		// AnnouncementMenu.TemaplateAnnouncementFromCampaign,
		// AnnouncementMenu.TemplateAnnouncementEdit,

		// Building Access
		BuildingAccessMenu.Group,
        BuildingAccessMenu.BuildingAccessServiceGroup,
        BuildingAccessMenu.Visitors,
        BuildingAccessMenu.Tenant,
		
		// Building
		BuildingMenu.Group,
        BuildingMenu.BuildingServiceGroup,
        BuildingMenu.ServiceRequestGroup,
        BuildingMenu.ServiceRequestShow,
        BuildingMenu.ServiceRequestList,
        BuildingMenu.ACRequestShow,
        BuildingMenu.ACRequestCreate,
        BuildingMenu.ACRequestEdit,
        BuildingMenu.IssueTypeList,
        BuildingMenu.IssueTypeEdit,
        BuildingMenu.UrgentServiceRequest,

		// Support
        SupportMenu.Group,
        SupportMenu.SupportGroup,
        SupportMenu.AccessLocalInformation,
        SupportMenu.Faq,
        SupportMenu.ContactCenter,
        SupportMenu.AppVersion,
        SupportMenu.AppMaintenance,
        SupportMenu.LegalContent,

		// Member Role
		MemberRoleMenu.Group,
        MemberRoleMenu.MemberRoleGroup,
        MemberRoleMenu.MemberManagement,
        MemberRoleMenu.MemberManagementCreate,
        MemberRoleMenu.MemberManagementEdit,
        MemberRoleMenu.RoleManagement,
        MemberRoleMenu.RoleManagementCreate,
        MemberRoleMenu.RoleManagementEdit,

		// Account
		AccountMenu.Group,
        AccountMenu.MyAccountGroup,
        AccountMenu.PersonalInfo,

		// Legal
		// LegalMenu.Group,
		// LegalMenu.LegalGroup,
		// LegalMenu.LegalContent,

		// CarPark
		CarParkMenu.Group,
        CarParkMenu.CarPark,
        CarParkMenu.CarAccessActivities,
        CarParkMenu.CarParkStoreWhiteList,
        CarParkMenu.CarParkMallProperty,
        CarParkMenu.CarParkDocumentType,
				CarParkMenu.CarParCampaign,
				CarParkMenu.CarParkSelfRedemption,
				CarParkMenu.CarParkSelfRedemptionDetail,

		//Art and Culture
        ArtCMenu.Group,
        ArtCMenu.ArtCGroup,
        ArtCMenu.ArtCLandingPage,
        ArtCMenu.ArtC,
        ArtCMenu.ArtCCreateArtC,
        ArtCMenu.ArtCEditArtC,
        ArtCMenu.ArtCProgram,
        ArtCMenu.ArtCCreateProgram,
        ArtCMenu.ArtCEditProgram,
        ArtCMenu.ArtCAddOn,
        ArtCMenu.ArtCCreateAddOn,
        ArtCMenu.ArtCEditAddOn,
        ArtCMenu.ArtCPlaylist,
        ArtCMenu.ArtCCreatePlaylist,
        ArtCMenu.ArtCEditPlaylist,
        ArtCMenu.ArtCPartner,
        ArtCMenu.ArtCCreatePartner,
        ArtCMenu.ArtCEditPartner,
        ArtCMenu.ArtCFaq,
        ArtCMenu.ArtCCreateFaq,
        ArtCMenu.ArtCEditFaq,
        ArtCMenu.ArtCOrderFaq,
        ArtCMenu.ArtCCreateBookingSetting,
        ArtCMenu.ArtCEditBookingSetting,
        ArtCMenu.ArtCBookingHistory,
        ArtCMenu.ArtCBookingStatus,
        ArtCMenu.ArtCEditBookingStatus,
        ArtCMenu.ArtCTicketScanner,
        ArtCMenu.ArtCResetTicket,

		//Sustainability
		SustainabilityMenu.Group,
        SustainabilityMenu.SustainGroup,
        SustainabilityMenu.Banner,
        SustainabilityMenu.PRBanner,
        SustainabilityMenu.ContentManagement,
        SustainabilityMenu.Library,
        SustainabilityMenu.PRBannerCreate,
        SustainabilityMenu.PRBannerEdit,
        SustainabilityMenu.ContentManagementCreate,
        SustainabilityMenu.ContentManagementEdit,
        SustainabilityMenu.ContentManagementSub,
        SustainabilityMenu.LibraryCreate,
        SustainabilityMenu.LibraryEdit,

		// Guard tour
		GuardTourMenu.Group,
        GuardTourMenu.GuardTourGroup,
        GuardTourMenu.ActionManagement,
        GuardTourMenu.ActionManagementCreate,
        GuardTourMenu.ActionManagementEdit,
        GuardTourMenu.TaskManagement,
        GuardTourMenu.TaskManagementCreate,
        GuardTourMenu.TaskManagementEdit,
        GuardTourMenu.SchedulePlan,
        GuardTourMenu.SchedulePlanCreate,
        GuardTourMenu.SchedulePlanEdit,
        GuardTourMenu.ActivityProcedures,
        GuardTourMenu.ActivityProceduresCreate,
        GuardTourMenu.ActivityProceduresEdit,
	

		// Operation app
		OpsappMenu.Group,
        OpsappMenu.OperaionAppGroup,
        OpsappMenu.OperationsOnboarding,
        OpsappMenu.OperationsOnboardingCreate,


		//UsageMonitoring
		UsageMonitoring.Group,
        UsageMonitoring.UsageMonitoringGroup,
        UsageMonitoring.UsageMonitoringSummery,
        UsageMonitoring.StaffTable,
        UsageMonitoring.Roster,
        UsageMonitoring.RosterComponant,
        UsageMonitoring.Componant,

    };
}
