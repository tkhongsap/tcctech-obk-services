aws ecr get-login-password | docker login --username AWS --password-stdin 730335418784.dkr.ecr.ap-southeast-1.amazonaws.com && \
docker build -t 730335418784.dkr.ecr.ap-southeast-1.amazonaws.com/ob-gw/uat:latest . --build-arg ENV=uat && \
docker push 730335418784.dkr.ecr.ap-southeast-1.amazonaws.com/ob-gw/uat:latest
kubectl scale deploy ob-gw-app --replicas=0
kubectl scale deploy ob-gw-app --replicas=1
#kubectl rollout restart deployment ob-gw
#730335418784.dkr.ecr.ap-southeast-1.amazonaws.com/ob-gw/uat:latest
