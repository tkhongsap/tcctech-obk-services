﻿using FluentValidation;
using MediatR;
using System.Text;

namespace TCCTOBK.OperationBackend.Application.Configuration.Validation;
public class CommandValidationBehavior<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
{
	private readonly IList<IValidator<TRequest>> _validators;

	public CommandValidationBehavior(IList<IValidator<TRequest>> validators)
	{
		this._validators = validators;
	}

	public Task<TResponse> Handle(TRequest request, RequestHandlerDelegate<TResponse> next, CancellationToken cancellationToken)
	{
		var errors = _validators
			.Select(v => v.Validate(request))
			.SelectMany(result => result.Errors)
			.Where(error => error != null)
			.ToList();

		if (errors.Any())
		{
			var errorBuilder = new StringBuilder();

			errorBuilder.AppendLine("Invalid command, reason: ");

			foreach (var error in errors)
			{
				errorBuilder.AppendLine(error.ErrorMessage);
			}

			throw new InvalidCommandException(errorBuilder.ToString(), null);
		}

		return next();
	}
}
