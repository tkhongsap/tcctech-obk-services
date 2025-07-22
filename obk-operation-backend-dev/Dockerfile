FROM --platform=$BUILDPLATFORM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG TARGETARCH
WORKDIR /app
COPY . .
WORKDIR "/app/TCCTOBK.OperationBackend/TCCTOBK.OperationBackend.Api"
RUN dotnet publish -a $TARGETARCH "TCCTOBK.OperationBackend.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
RUN apt-get update && apt-get install -y libc6

RUN apt-get update && apt-get install -y build-essential libgdiplus libc6-dev

# RUN apt-get update && apt-get install -y build-essential && apt-get install -y libgdiplus && apt-get install -y libc6-dev
RUN cp /usr/lib/x86_64-linux-gnu/libdl.so.2 /usr/share/dotnet/shared/Microsoft.NETCore.App/8.0.18/libdl.so

ARG GIT_COMMIT_HASH
RUN echo "$GIT_COMMIT_HASH" > version.txt
EXPOSE 80
ENV ASPNETCORE_URLS=http://+:80
ENV TZ="Asia/Bangkok"
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "TCCTOBK.OperationBackend.Api.dll"]