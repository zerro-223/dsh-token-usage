# Security Policy

## Reporting a Vulnerability

If you discover a security issue in this plugin, please do **not** open a public
issue. Instead, report it privately via GitHub's security advisory feature:

https://github.com/zerro-223/dsh-token-usage/security/advisories/new

or by opening an issue with the `security` label (visible only to the
maintainer). Please include a minimal reproduction when possible.

## Data notes

Usage records are stored locally under
`~/.dsh/storages/token-stats/usage.jsonl` on the machine running DSH.
They are never transmitted anywhere; the aggregation API is served on the
loopback Web server only.
