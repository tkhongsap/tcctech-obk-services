aws ecr get-login-password | docker login --username AWS --password-stdin 418772626632.dkr.ecr.ap-southeast-1.amazonaws.com && \
docker build -t 418772626632.dkr.ecr.ap-southeast-1.amazonaws.com/one-bangkok-dev:ob-gw . --build-arg ENV=dev && \
docker push 418772626632.dkr.ecr.ap-southeast-1.amazonaws.com/one-bangkok-dev:ob-gw && \
kubectl rollout restart deployment ob-gw
