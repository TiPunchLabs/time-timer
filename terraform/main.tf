# Configuration du provider GitHub
provider "github" {
  token = var.github_token
  owner = var.github_owner
}

# Ressource du dépôt GitHub
resource "github_repository" "this" {
  name        = var.repository_name
  description = var.repository_description
  visibility  = var.repository_visibility

  has_issues   = true
  has_wiki     = false
  has_projects = false

  auto_init             = false
  delete_branch_on_merge = true
}

# Branch protection for main
resource "github_branch_protection" "main" {
  repository_id = github_repository.this.node_id
  pattern       = "main"

  required_status_checks {
    strict = true
    contexts = [
      "Lint, Type-check & Tests",
    ]
  }

  required_pull_request_reviews {
    required_approving_review_count = 0
  }

  enforce_admins = false
}
