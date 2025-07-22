resource "aws_ecr_repository" "default" {
  name                 = "${var.app_name}-${var.env}"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }
}

resource "aws_ecr_lifecycle_policy" "default" {
  repository = aws_ecr_repository.default.name
  policy = jsonencode(
    {
      rules = [
        {
          rulePriority = 1,
          description  = "Keep last image",
          selection = {
            tagStatus     = "any",
            countType     = "imageCountMoreThan",
            countNumber   = 1
          },
          action = {
            type = "expire"
          }
        }
      ]
    }
  )
}
