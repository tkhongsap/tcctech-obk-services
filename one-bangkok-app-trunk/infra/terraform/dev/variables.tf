variable "region" {
  type        = string
  default     = "ap-southeast-1"
}
variable "app_name" {
  type        = string
  default     = "one-bangkok"
}
variable "env" {
  type        = string
  default     = "dev"
}

variable "private_cidr_blocks" {
  type        = list(string)
  default     = [
                "0.0.0.0/0",
                "172.16.0.0/16"
              ]
}

# variable "s3_bucket" {
#   type        = string
#   default     = "sharge-infra"
# }
# variable "domain" {
#   type        = string
#   default     = "shargewebapp.com"
# }
# variable "zone_id" {
#   type        = string
#   default     = "Z101658722AHPMPOMCTZT"
# }
# variable "db_user" {
#   type        = string
#   default     = "sharge"
# }
# variable "db_password" {
#   type        = string
#   default     = "27400d8582200b57c3ce9dffb4d1ba70"
# }
# variable "db_name" {
#   type        = string
#   default     = "sharge_webapp_staging"
# }
