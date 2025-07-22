resource "aws_security_group" "rds_sg" {
  name        = "rds-sg-${ var.env }"
  description = "Allow inbound traffic to RDS"
  vpc_id          = module.vpc.vpc_id

  ingress {
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0", "172.16.0.0/16"] # Replace this with your EKS cluster's VPC CIDR block or specific CIDR blocks
  }
}

resource "aws_db_subnet_group" "rds_subnet_group" {
  name       = "rds-subnet-group-${ var.env }"
  subnet_ids = module.vpc.public_subnets # Replace these with your VPC subnets

  tags = {
    Name = "rds_subnet_group"
  }
}

resource "aws_db_instance" "ob_iam_rds" {
  auto_minor_version_upgrade = true
  allocated_storage    = 20
  storage_type         = "gp2"
  engine               = "postgres"
  engine_version       = "15.2"
  instance_class       = "db.t3.micro"
  identifier           = "ob-iam-${ var.env }"
  db_name              = "ob_iam_development"
  username             = "postgres"
  password             = "2a843c492f23fdbd6d586d0911d275fc" # Use a secure password
  port                 = 5432
  publicly_accessible  = true
  db_subnet_group_name = aws_db_subnet_group.rds_subnet_group.name
  vpc_security_group_ids = [aws_security_group.rds_sg.id]
  skip_final_snapshot  = true
  tags = {
    Name = "ob-iam-${ var.env }"
  }

  depends_on = [aws_db_subnet_group.rds_subnet_group]
}

output "rds_endpoint" {
  value = aws_db_instance.ob_iam_rds.endpoint
}