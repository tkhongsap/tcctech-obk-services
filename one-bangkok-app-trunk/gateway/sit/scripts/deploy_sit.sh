aws ecr get-login-password | docker login --username AWS --password-stdin 730335418784.dkr.ecr.ap-southeast-1.amazonaws.com && \
docker build -t 730335418784.dkr.ecr.ap-southeast-1.amazonaws.com/ob-gw/sit:latest . --build-arg ENV=sit && \
docker push 730335418784.dkr.ecr.ap-southeast-1.amazonaws.com/ob-gw/sit:latest
kubectl scale deploy ob-gw-app --replicas=0
kubectl scale deploy ob-gw-app --replicas=1