helm repo add elastic https://helm.elastic.co
helm repo update

wget https://raw.githubusercontent.com/elastic/helm-charts/main/elasticsearch/values.yaml -O elastic-values.yaml
wget https://raw.githubusercontent.com/elastic/helm-charts/main/kibana/values.yaml -O kibana-values.yaml

helm install elasticsearch --values elastic-values.yaml  elastic/elasticsearch

helm install kibana --values kibana-values.yaml  elastic/elasticsearch


aws eks create-addon --cluster-name obk-eks-uat --addon-name aws-ebs-csi-driver \
  --service-account-role-arn arn:aws:iam::$(aws sts get-caller-identity --query Account --output text):role/AmazonEKS_EBS_CSI_DriverRole

aws eks describe-addon --cluster-name obk-eks-uat --addon-name aws-ebs-csi-driver --query "addon.addonVersion" --output text

aws eks describe-addon-versions --addon-name aws-ebs-csi-driver --kubernetes-version 1.29 \
  --query "addons[].addonVersions[].[addonVersion, compatibilities[].defaultVersion]" --output text


aws eks delete-addon --cluster-name obk-eks-uat --addon-name aws-ebs-csi-driver --preserve

aws eks describe-addon --cluster-name obk-eks-uat


aws eks create-addon --cluster-name obk-eks-uat --addon-name aws-ebs-csi-driver \
  --service-account-role-arn arn:aws:iam::$(aws sts get-caller-identity --query Account --output text):role/obk-uat-ng-role