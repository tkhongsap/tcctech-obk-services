using System.Text.Json;
using System.Text.Json.Serialization;
using TCCT.ServiceAbstraction.Application.Configuration.Commands;
using TCCT.ServiceAbstraction.Application.Contracts.Payment;
using TCCT.ServiceAbstraction.Application.Contracts;

namespace TCCT.ServiceAbstraction.Application.Features.Payment.ArgentoPromptPayCharge;


public sealed class ArgentoPromptPayChargeCommandHandler : ICommandHandler<ArgentoPromptPayChargeCommand, ArgentoPromptPayChargeResult>
{
	private readonly IPaymentService _service;
	private readonly IRedisService _redisService;
	public ArgentoPromptPayChargeCommandHandler(IPaymentService service, IRedisService redis)
	{
		_redisService = redis;
		_service = service;
	}

	public async Task<ArgentoPromptPayChargeResult> Handle(ArgentoPromptPayChargeCommand request, CancellationToken cancellationToken)
	{
		string keyCacheToken = $"promptpay_{request.InvoiceNo}";
		if (request.Cache == true)
		{
			var cachePromptpay = await _redisService.GetCacheAsync(keyCacheToken);
			var cacheData = cachePromptpay == null ? null : JsonSerializer.Deserialize<ArgentoPromptPayChargeResult>(cachePromptpay);

			if (cacheData != null)
			{
				return cacheData;
			}
		}

		var srcres = await _service.ArgentoPaymentSource(request.InvoiceNo, request.Description, request.Amount, "THB", "promptpay", request.SubCode);
		var res = await _service.ArgentoChargePromptPay(request.Description, srcres.sourceId, 5, request.SubCode);

		DateTime now = DateTime.Now;
        TimeSpan expiredTime = TimeSpan.FromMinutes(res.qrTimeOut);
		DateTime expiredDate = now.Add(expiredTime);
		if (res != null)
		{
			res.qrExpiredDate = expiredDate;
			TimeSpan cacheExpiredTime = expiredTime - TimeSpan.FromSeconds(10);
			await _redisService.SetCacheAsync(keyCacheToken, JsonSerializer.Serialize(res), cacheExpiredTime); //add 10s gap for req timeout
		}
		return res;
	}

}

