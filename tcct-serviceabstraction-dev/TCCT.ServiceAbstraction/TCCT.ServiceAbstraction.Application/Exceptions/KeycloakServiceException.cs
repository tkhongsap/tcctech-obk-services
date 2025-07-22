namespace TCCT.ServiceAbstraction.Application.Exceptions;
public class KeycloakServiceException : ServiceAbstractionException
{
	public static KeycloakServiceException KCS001 { get; } = new KeycloakServiceException(nameof(KCS001), "Invalid user credentials");
	public static KeycloakServiceException KCS002 { get; } = new KeycloakServiceException(nameof(KCS002), "User not found");

	public static KeycloakServiceException KCS003(string message)
	{
		return new KeycloakServiceException(nameof(KCS003), $"Keycloak error, {message}");
	}
	public static KeycloakServiceException KCS004 { get; } = new KeycloakServiceException(nameof(KCS004), "Cannot update password");
	public static KeycloakServiceException KCS005 { get; } = new KeycloakServiceException(nameof(KCS005), "Cannot add attribute, Attribute(s) have already full");
	public static KeycloakServiceException KCS006 { get; } = new KeycloakServiceException(nameof(KCS006), "Failed to add attribute");
	public static KeycloakServiceException KCS007 { get; } = new KeycloakServiceException(nameof(KCS007), "Failed to remove attribute");
	public static KeycloakServiceException KCS008 { get; } = new KeycloakServiceException(nameof(KCS008), "Cannot remove attribute, it dose not exist");
	public static KeycloakServiceException KCS009 { get; } = new KeycloakServiceException(nameof(KCS009), "Cannot remove last attribute");
	public static KeycloakServiceException KCS010 { get; } = new KeycloakServiceException(nameof(KCS010), "Cannot add attribute, it already exists");
	public static KeycloakServiceException KCS011 { get; } = new KeycloakServiceException(nameof(KCS011), "Cannot remove email attribute");
	public static KeycloakServiceException KCS012 { get; } = new KeycloakServiceException(nameof(KCS012), "Keycloak is not available.");
	public static KeycloakServiceException KCS013 { get; } = new KeycloakServiceException(nameof(KCS013), "User already exists");
	private KeycloakServiceException(string code, string message) : base(code, message)
	{
	}
	private KeycloakServiceException(string code, string message, Exception innerexception) : base(code, message, innerexception)
	{
	}

}
