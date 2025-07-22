start Database
	cd .\DockerCompose\TCCTOBK-OperationBackend\TCCTOBK-Database\
> docker compose up -d

update Database
run in root project
> dotnet ef database update --context TCCTOBKContext --project TCCTOBK.OperationBackend.Infrastructure --startup-project TCCTOBK.OperationBackend.Api


dotnet ef migrations add <<MigrationName>> --context ITCCTOBKContext --project TCCTOBK.OperationBackend.Infrastructure --startup-project TCCTOBK.OperationBackend.Api -o Database/Migrations