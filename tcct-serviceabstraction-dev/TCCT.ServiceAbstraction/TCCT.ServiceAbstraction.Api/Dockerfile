FROM --platform=$BUILDPLATFORM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG TARGETARCH
WORKDIR /app
COPY . .
WORKDIR "/app/TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api"
RUN dotnet publish -a $TARGETARCH "TCCT.ServiceAbstraction.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80
ENV ASPNETCORE_URLS=http://+:80
ENV TZ="Asia/Bangkok"
COPY --from=build /app/publish .
COPY --from=build /app/TCCT.ServiceAbstraction/TCCT.ServiceAbstraction.Api/version.txt .
ENTRYPOINT ["dotnet", "TCCT.ServiceAbstraction.Api.dll"]