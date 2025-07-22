# resource "aws_db_instance" "ob_websocket_rds" {
#   auto_minor_version_upgrade = true
#   allocated_storage    = 20
#   storage_type         = "gp2"
#   engine               = "postgres"
#   engine_version       = "15.2"
#   instance_class       = "db.t3.micro"
#   identifier           = "ob-websocket-${ var.env }"
#   db_name              = "ob_websocket_development"
#   username             = "postgres"
#   password             = "2a843c492f23fdbd6d586d0911d275fc" # Use a secure password
#   port                 = 5432
#   publicly_accessible  = true
#   db_subnet_group_name = aws_db_subnet_group.rds_subnet_group.name
#   vpc_security_group_ids = [aws_security_group.rds_sg.id]
#   skip_final_snapshot  = true
#   tags = {
#     Name = "ob-websocket-${ var.env }"
#   }

#   depends_on = [aws_db_subnet_group.rds_subnet_group]
# }

# output "rds_ob_websocket_endpoint" {
#   value = aws_db_instance.ob_websocket_rds.endpoint
# }
