aws ecr get-login-password | docker login --username AWS --password-stdin 730335418784.dkr.ecr.ap-southeast-1.amazonaws.com && \
docker build --platform=linux/amd64 -t 730335418784.dkr.ecr.ap-southeast-1.amazonaws.com/ob-websocket/uat:latest . --build-arg ENV=uat && \
docker push 730335418784.dkr.ecr.ap-southeast-1.amazonaws.com/ob-websocket/uat:latest
