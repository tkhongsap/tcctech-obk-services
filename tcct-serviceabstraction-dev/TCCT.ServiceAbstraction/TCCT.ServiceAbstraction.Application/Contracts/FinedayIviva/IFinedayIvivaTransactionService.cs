using TCCT.ServiceAbstraction.Application.Features.FinedayIviva.Transaction.GetDataTransactionCarpark;
using TCCT.ServiceAbstraction.Application.Features.FinedayIviva.Transaction.GetDataTransactionMember;
using TCCT.ServiceAbstraction.Application.Features.FinedayIviva.Transaction.GetDataTransactionTurnstile;
using TCCT.ServiceAbstraction.Application.Features.FinedayIviva.Transaction.GetDataTransactionVisitor;

namespace TCCT.ServiceAbstraction.Application.Contracts.FinedayIviva;
public interface IFinedayIvivaTransactionService
{
	Task<GetDataTransactionCarparkResult> GetDataTransactionCarpark(int page, int perPage, string? carNo, string? entryDate, string? exitDate, string? logEntry, int? statusLog, string? terminalEntry, string? ticketNo, int vehicleType);
	Task<GetDataTransactionMemberResult> GetDataTransactionMember(int page, int perpage, string? search, string? startDate, string? endDate);
	Task<GetDataTransactionTurnstileResult> GetDataTransactionTurnstile(int page, int perpage, string? search, string? startDate, string? endDate);
	Task<GetDataTransactionVisitorResult> GetDataTransactionVisitor(int page, int perPage, string? search, string? startDate, string? endDate);
}
