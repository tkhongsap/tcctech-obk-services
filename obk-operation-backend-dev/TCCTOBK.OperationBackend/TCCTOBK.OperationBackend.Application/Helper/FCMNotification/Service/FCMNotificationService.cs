using System;
using FirebaseAdmin;
using FirebaseAdmin.Messaging;
using Google.Apis.Auth.OAuth2;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using TCCTOBK.OperationBackend.Application.Helper.FCMNotification.Model;
using TCCTOBK.OperationBackend.Domain;


namespace TCCTOBK.OperationBackend.Application.Helper.FCMNotification.Service;
public class FCMNotificationService : IFCMNotificationService
{
  private static bool _isFirebaseAppInitialized = false;

  public async Task<(string, bool)> SendNotification(string title, string message, string token)
  {
    if (!_isFirebaseAppInitialized)
    {
      var envVars = new FirebaseAccount()
      {
        type = DomainConfig.FCM.Type,
        project_id = DomainConfig.FCM.ProjectId,
        private_key_id = DomainConfig.FCM.PrivateKeyId,
        private_key = DomainConfig.FCM.PrivateKey,
        client_email = DomainConfig.FCM.ClientEmail,
        client_id = DomainConfig.FCM.ClientId,
        auth_uri = DomainConfig.FCM.AuthUri,
        token_uri = DomainConfig.FCM.TokenUri,
        auth_provider_x509_cert_url = DomainConfig.FCM.AuthProviderX509CertUrl,
        client_x509_cert_url = DomainConfig.FCM.ClientX509CertUrl,
        universe_domain = DomainConfig.FCM.UniverseDomain
      };
      // Serialize the envVars object to JSON
      string jsonEnvVars = JsonConvert.SerializeObject(envVars);

      // Pass the serialized JSON string to GoogleCredential.FromJson
      var googleCredential = GoogleCredential.FromJson(jsonEnvVars);

      // Initialize FirebaseApp with the credential
      FirebaseApp.Create(new AppOptions
      {
        Credential = googleCredential
      });

      _isFirebaseAppInitialized = true;
    }

    var sendmessage = new Message()
    {
      Token = token,
      Notification = new Notification
      {
        Title = title,
        Body = message,
      }
    };

    try
    {
      string response = await FirebaseMessaging.DefaultInstance.SendAsync(sendmessage);
      return (response, true);
    }
    catch (Exception ex)
    {
      return (ex.Message, false);
    }
  }
}
