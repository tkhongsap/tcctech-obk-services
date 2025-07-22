using MediatR;
using Microsoft.Extensions.Caching.Distributed;
using Newtonsoft.Json;
using System.Text;
using TCCTOBK.OperationBackend.Application.Features.CMS.MemberManagement.Query.GetMemberKeyCloakUserId;
using TCCTOBK.OperationBackend.Application.Helper.Auditable;

namespace TCCTOBK.OperationBackend.Api.Middleware;

public class AudiableMiddleware
{
	private readonly RequestDelegate _next;
	private readonly IDistributedCache _cache;

	public AudiableMiddleware(RequestDelegate next, IDistributedCache cache)
	{
		_next = next;
		_cache = cache;
	}

	public async Task Invoke(HttpContext context, IMediator mediator)
	{
		var request = context.Request;
		if (request.ContentLength > 0)
		{
			try
			{
				if (context.Request.ContentType != null && context.Request.ContentType.Contains("application/json"))
				{
					// Enable buffering to read the request body
					context.Request.EnableBuffering();

					using (var reader = new StreamReader(context.Request.Body, Encoding.UTF8, leaveOpen: true))
					{
						var body = await reader.ReadToEndAsync();
						var model = JsonConvert.DeserializeObject<KeyCloakModel>(body);
						if (model != null && model.KeyCloakUserId != null)
						{
							var keyCache = "GetMemberKeyCloakUserIdQuery:" + model.KeyCloakUserId;
							var cacheData = await this._cache.GetStringAsync(keyCache);
							if (cacheData == null)
							{
								var query = new GetMemberKeyCloakUserIdQuery(model.KeyCloakUserId);
								var memberData = await mediator.Send(query);
								cacheData = JsonConvert.SerializeObject(memberData);
								if (cacheData != null)
								{
									var options = new DistributedCacheEntryOptions().SetSlidingExpiration(TimeSpan.FromSeconds(200));
									await _cache.SetStringAsync(keyCache, cacheData, options);
								}
							}

							if (cacheData != null)
							{
								var memberName = JsonConvert.DeserializeObject<GetMemberKeyCloakUserIdResult>(cacheData);

								if (memberName != null)
								{
									context.Items["KeyCloakUserId"] = model.KeyCloakUserId;
									context.Items["MemberName"] = memberName.Name;
									context.Items["MID"] = memberName.MID;
								}
							}
						}
						request.Body.Position = 0;
					}
				}
			}
			catch (Exception ex)
			{
				throw new Exception("auth", ex);
			}
		}

		await _next(context);

	}
}
