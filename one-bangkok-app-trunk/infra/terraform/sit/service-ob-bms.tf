resource "aws_db_instance" "ob_bms_rds" {
  auto_minor_version_upgrade = true
  allocated_storage    = 20
  storage_type         = "gp2"
  engine               = "postgres"
  engine_version       = "15.4"
  instance_class       = "db.t3.micro"
  identifier           = "ob-bms-${ var.env }"
  db_name              = "ob_bms_development"
  username             = "postgres"
  password             = "2a843c492f23fdbd6d586d0911d275fc" # Use a secure password
  port                 = 5432
  publicly_accessible  = true
  db_subnet_group_name = aws_db_subnet_group.rds_subnet_group.name
  vpc_security_group_ids = [aws_security_group.rds_sg.id]
  skip_final_snapshot  = true
  tags = {
    Name = "ob-bms-${ var.env }"
  }

  depends_on = [aws_db_subnet_group.rds_subnet_group]
}

resource "aws_s3_bucket" "ob-bms" {
    bucket = "bucket-ob-bms-${ var.env }" 
}

resource "aws_s3_bucket_ownership_controls" "ob-bms" {
  bucket = aws_s3_bucket.ob-bms.id
  rule {
    object_ownership = "BucketOwnerPreferred"
  }
}

resource "aws_s3_bucket_public_access_block" "ob-bms" {
  bucket = aws_s3_bucket.ob-bms.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}


resource "aws_s3_bucket_acl" "ob-bms" {
  depends_on = [aws_s3_bucket_ownership_controls.ob-bms,
                aws_s3_bucket_public_access_block.ob-bms,
              ]

  bucket = aws_s3_bucket.ob-bms.id
  acl    = "public-read"
}

output "rds_ob_bms_endpoint" {
  value = aws_db_instance.ob_bms_rds.endpoint
}
