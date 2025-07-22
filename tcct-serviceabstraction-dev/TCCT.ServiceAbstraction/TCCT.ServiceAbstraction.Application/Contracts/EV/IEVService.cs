using TCCT.ServiceAbstraction.Application.Features.EV.Command.Register;
using TCCT.ServiceAbstraction.Application.Features.EV.Command.Authorize;
using TCCT.ServiceAbstraction.Application.Features.EV.Command.SignOut;
using TCCT.ServiceAbstraction.Application.Features.EV.Query.GetPlace;
using TCCT.ServiceAbstraction.Application.Features.EV.Query.GetPlaces;
using TCCT.ServiceAbstraction.Application.Features.EV.Command.SessionInit;
using TCCT.ServiceAbstraction.Application.Features.EV.Command.SessionStart;
using TCCT.ServiceAbstraction.Application.Features.EV.Command.SessionStop;
using TCCT.ServiceAbstraction.Application.Features.EV.Query.GetSession;
using TCCT.ServiceAbstraction.Application.Features.EV.Query.GetSessions;
using TCCT.ServiceAbstraction.Application.Features.EV.Command.SessionAccess;
using TCCT.ServiceAbstraction.Application.Features.EV.Command.Reserve;
using TCCT.ServiceAbstraction.Application.Features.EV.Query.GetReserve;
using TCCT.ServiceAbstraction.Application.Features.EV.Query.GetReserves;
using TCCT.ServiceAbstraction.Application.Features.EV.Command.ReserveCancel;
using TCCT.ServiceAbstraction.Application.Features.EV.Command.ReserveCheck;
using TCCT.ServiceAbstraction.Application.Features.EV.Query.GetInvoice;
using TCCT.ServiceAbstraction.Application.Features.EV.Query.GetInvoices;
using TCCT.ServiceAbstraction.Application.Features.EV.Query.GetReceipt;
using TCCT.ServiceAbstraction.Application.Features.EV.Query.GetReceipts;
using TCCT.ServiceAbstraction.Application.Features.EV.Command.CheckoutInvoice;
using TCCT.ServiceAbstraction.Application.Features.EV.Command.CancelInvoice;
using TCCT.ServiceAbstraction.Application.Features.EV.Command.ReceiptRefund;
using TCCT.ServiceAbstraction.Application.Features.EV.Query.GetPlaceBuilding;
using TCCT.ServiceAbstraction.Application.Features.EV.Query.GetAccount;

namespace TCCT.ServiceAbstraction.Application.Contracts.EV;

public interface IEVService
{
	Task<RegisterResult> Register(RegisterCommand req);
	Task<AuthorizeResult> Authorize(AuthorizeCommand req);
	Task<SignOutResult> SignOut(SignOutCommand req);
	Task<PlaceResult> GetPlace(PlaceQuery req);
	Task<PlacesResult> GetPlaces(PlacesQuery req);
	Task<SessionInitResult> SessionInit(SessionInitCommand req);
	Task<SessionStartResult> SessionStart(SessionStartCommand req);
	Task<SessionStopResult> SessionStop(SessionStopCommand req);
	Task<GetSessionResult> GetSession(GetSessionQuery req);
	Task<GetSessionsResult> GetSessions(GetSessionsQuery req);
	Task<SessionAccessResult> SessionAccess(SessionAccessCommand req);
	Task<GetReserveResult> GetReserve(GetReserveQuery req);
	Task<GetReservesResult> GetReserves(GetReservesQuery req);
	Task<ReserveResult> Reserve(ReserveCommand req);
	Task<ReserveCancelResult> ReserveCancel(ReserveCancelCommand req);
	Task<ReserveCheckResult> ReserveCheck(ReserveCheckCommand req);
	Task<GetInvoiceResult> GetInvoice(GetInvoiceQuery req);
	Task<GetInvoicesResult> GetInvoices(GetInvoicesQuery req);
	Task<GetReceiptResult> GetReceipt(GetReceiptQuery req);
	Task<GetReceiptsResult> GetReceipts(GetReceiptsQuery req);
	Task<CheckoutInvoiceResult> CheckoutInvoice(CheckoutInvoiceCommand req);
	Task<CancelInvoiceResult> CancelInvoice(CancelInvoiceCommand req);
	Task<ReceiptRefundResult> ReceiptRefund(ReceiptRefundCommand req);
	Task<PlaceBuildingResult> GetPlaceBuilding(PlaceBuildingQuery req);
	Task<GetAccountResult> GetAccount(GetAccountQuery req);
}