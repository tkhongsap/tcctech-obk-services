using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Contracts.API;
using TCCTOBK.OperationBackend.Application.Features.Mobile.CWO.Model.CWOCommentModel;

namespace TCCTOBK.OperationBackend.Application;

public class CWOTransactionsHandler : IQueryHandler<CWOTransactionsQuery, List<CWOTransactionsResult>>
{
	private readonly IAbstractionService _apiService;

	public CWOTransactionsHandler(IAbstractionService apiService)
	{
		_apiService = apiService;
	}

	public async Task<List<CWOTransactionsResult>> Handle(CWOTransactionsQuery request, CancellationToken cancellationToken)
	{
		var transactions = await _apiService.CertisTransaction.CWOTransactions(request.CWOId);
		var document = await _apiService.CertisTransaction.GetDocumentFiles("CWO", request.CWOId.ToString());
		var comment = await _apiService.CertisTransaction.GetCommentCWO(request.CWOId.ToString());

		var result = new List<CWOTransactionsResult>();
		foreach (var item in transactions)
		{
			var documentId = document.FirstOrDefault(x => !string.IsNullOrEmpty(x.SearchTags) && x.SearchTags.EndsWith(item.Id.ToString()));
			var data = new CWOTransactionsResult
			{
				Id = item.Id,
				CwoId = item.CwoId,
				Message = item.Message,
				CreatedBy = item.CreatedBy,
				CreatedOn = item.CreatedOn,
				ImageId = documentId?.Id,
				Comment = GetComment(comment, item.CreatedOn),
				CreatedDate = item.CreatedOn.AddHours(7).ToString("dd MMM yyyy h:mm:sstt")
			};
			result.Add(data);
		}
		result = result.OrderByDescending(x => x.CreatedOn).ToList();
		return result;
	}

	private string GetComment(List<CWOCommentModel> comment, DateTime check)
	{
		var res = "-";
		var data = comment.FirstOrDefault(x => x.createdOn == check);
		if (data != null)
		{
			return data.comment;
		}
		return res;
	}
}