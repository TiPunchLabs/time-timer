# ADR-009: Terraform for GitHub Repository Management

## Status
Accepted

## Date
2025-12-20

## Context
The GitHub repository settings (description, visibility, branch protection, feature toggles) need to be managed consistently and reproducibly.

## Decision
Use Terraform with the GitHub provider to manage the repository as Infrastructure as Code.

## Rationale
- **Reproducibility**: Repository settings are versioned in code, not configured manually via UI
- **Consistency**: Same configuration can be applied to other TiPunchLabs projects
- **Auditability**: Changes to repo settings go through the same review process as code
- **DevOps practice**: Aligns with the maintainer's DevOps background

## Configuration
```hcl
resource "github_repository" "this" {
  has_issues              = true
  has_wiki                = false
  has_projects            = false
  delete_branch_on_merge  = true
}
```

Key settings:
- Issues enabled for bug tracking
- Wiki and projects disabled (docs live in repo)
- Auto-delete branches after merge (clean branch history)

## Secrets Management
- GitHub token stored in `pass` (password store)
- Loaded via `direnv` (`.envrc`) — never committed
- `terraform.tfvars` contains non-secret variables

## Alternatives Considered
- **GitHub UI**: Quick but not reproducible, settings drift over time
- **GitHub CLI (`gh`)**: Scriptable but not declarative, no state tracking
- **Pulumi**: Similar IaC approach but adds a runtime dependency, less widespread

## Consequences
- `terraform/` directory at project root
- Requires Terraform >= 1.0 and a GitHub token for changes
- `.terraform/` and state files should be in `.gitignore` (state may contain sensitive data)
