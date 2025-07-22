```
eksctl create addon --name aws-ebs-csi-driver --cluster YourClusterNameHere --service-account-role-arn arn:aws:iam::$(aws sts get-caller-identity --query Account --output text):role/AmazonEKS_EBS_CSI_DriverRole --force
```


## step 1 (Install CRDs)
```
helm repo add elastic https://helm.elastic.co
helm repo update

helm install elastic-operator elastic/eck-operator -n elastic-system --create-namespace
```


## step 2 (Priority classes)
```
kubectl apply -f elastic-priority-classes.yaml
```

## step 3 (Create elastic cluster)
```
kubectl apply -f elasticsearch-cluster.yaml -n elastic-system
```

```
kubectl get secret elastic-cluster-es-elastic-user -o go-template='{{.data.elastic | base64decode}}' -n elastic-system
```

## step 4 (Kibana instance)
```
kubectl apply -f kibana-instance.yaml -n elastic-system
```


## step 5 (install filebeat)
```
curl -L -O https://raw.githubusercontent.com/elastic/beats/8.6/deploy/kubernetes/filebeat-kubernetes.yaml
```


Set the following ENV values in the filebeat DaemonSet accordingly.
```
- name: ELASTICSEARCH_HOST
  value: elastic-cluster-es-http.<ELASTIC_NAMESPACE>.SVC
- name: ELASTICSEARCH_PORT
  value: "9200"
- name: ELASTICSEARCH_USERNAME
  value: elastic
- name: ELASTICSEARCH_PASSWORD
  value: <PASSWORD_FROM_THE_SECRET>

```

In addition to that, set the following configurations in the filebeat-config configmap.
```
 output.elasticsearch:
      ## SET BY DEFAULT ##
      hosts: ['${ELASTICSEARCH_HOST:elasticsearch}:${ELASTICSEARCH_PORT:9200}']
      username: ${ELASTICSEARCH_USERNAME}
      password: ${ELASTICSEARCH_PASSWORD}
      ## SET BY DEFAULT ##
      
      ## ADD THESE TWO LINES IF FILEBEAT AGENTS FAIL TO SEND LOGS TO THE CLUSTER ##
      protocol: "https"
      ssl.verification_mode: none

      ## CUSTOM INDEX PATTERN
      index: "filebeat-aks-devops-prod-%{[agent.version]}"

    setup.template:
      name: "filebeat-aks-devops-prod"
      pattern: "filebeat-aks-devops-prod-%{[agent.version]}"
```


```
kubectl apply -f filebeat-kubernetes.yaml
```

```
kubectl logs -f filebeat-XXXXX -n filebeat
```

```
kubectl port-forward svc/kibana-kb-http 15601:5601 -n elastic-system
```


## cleanup
```
helm uninstall elastic-operator -n elastic-system
kubectl delete -f elastic-priority-classes.yaml
kubectl delete -f elasticsearch-cluster.yaml -n elastic-system
kubectl delete -f kibana-instance.yaml -n elastic-system
kubectl delete -f filebeat-kubernetes.yaml
```

aws eks create-addon --cluster-name obk-eks-uat --addon-name aws-ebs-csi-driver \
  --service-account-role-arn arn:aws:iam::$(aws sts get-caller-identity --query Account --output text):role/obk-uat-ng-role

aws eks delete-addon --cluster-name obk-eks-uat --addon-name aws-ebs-csi-driver --preserve