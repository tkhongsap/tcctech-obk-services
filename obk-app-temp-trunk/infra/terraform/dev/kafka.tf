# Use kraf on dev and sit to save cost
# resource "aws_msk_configuration" "kafka_config" {
#   kafka_versions    = ["3.4.0"] 
#   name              = "kafka-config-${ var.env }"
#   server_properties = <<EOF
# auto.create.topics.enable = true
# delete.topic.enable = true
# EOF
# }

# resource "aws_msk_cluster" "kafka" {
#   cluster_name           = "kafka-${var.env}"
#   kafka_version          = "3.4.0"
#   number_of_broker_nodes = length(data.aws_availability_zones.available.names)
#   broker_node_group_info {
#     instance_type = "kafka.t3.small" # default value
#     storage_info {
#       ebs_storage_info {
#         volume_size = 1000
#       }
#     }
#     client_subnets = module.vpc.private_subnets
#     security_groups = [aws_security_group.kafka.id]
#   }
#   client_authentication {
#     unauthenticated = true
#     sasl {
#       iam = false
#       scram = false
#     }
#     tls {}
#   }
#   encryption_info {
#     encryption_in_transit {
#       client_broker = "TLS_PLAINTEXT"
#     }
#   }
#   configuration_info {
#     arn      = aws_msk_configuration.kafka_config.arn
#     revision = aws_msk_configuration.kafka_config.latest_revision
#   }
#   open_monitoring {
#     prometheus {
#       jmx_exporter {
#         enabled_in_broker = true
#       }
#       node_exporter {
#         enabled_in_broker = true
#       }
#     }
#   }
# }

# resource "aws_security_group" "kafka" {
#   name   = "kafka-${var.env}"
#   vpc_id = module.vpc.vpc_id
#   ingress {
#     description      = ""
#     from_port        = 0
#     ipv6_cidr_blocks = []
#     prefix_list_ids  = []
#     protocol         = "-1"
#     security_groups  = []
#     self             = false
#     to_port          = 0
#     cidr_blocks = ["0.0.0.0/0"]
#   }
#   ingress {
#     description      = ""
#     from_port        = 0
#     ipv6_cidr_blocks = []
#     prefix_list_ids  = []
#     protocol         = "TCP"
#     security_groups  = []
#     self             = false
#     to_port          = 9092
#     cidr_blocks = ["0.0.0.0/0"]
#   }
#   egress {
#     from_port   = 0
#     to_port     = 0
#     protocol    = "-1"
#     cidr_blocks = ["0.0.0.0/0"]
#   }
# }
