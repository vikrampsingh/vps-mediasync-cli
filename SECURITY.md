# Security Policy

## 1. Scope

MediaSync CLI is a local-first tool for managing personal media, including backing up files from Android devices and performing media cleanup operations.

Security is an important part of the project. We welcome reports of vulnerabilities that could compromise user data, device access, filesystem integrity, or the safe operation of the application.

## 2. Reporting a Vulnerability

**Please do not publicly disclose an unpatched security vulnerability.**

If you discover a potential security issue, report it privately through a security reporting channel configured for this repository.

If GitHub private vulnerability reporting is enabled, use the repository's **Security → Report a vulnerability** workflow.

If no private reporting channel is available, contact the project maintainer privately through an established contact method. Do not include sensitive personal data, private media, credentials, or access tokens in a public issue.

When reporting a vulnerability, include as much of the following information as you can safely provide:

- A clear description of the vulnerability.
- The potential impact and affected functionality.
- The affected version, commit, or environment.
- Steps to reproduce the issue.
- Proof-of-concept code or logs, where appropriate and safe.
- Any known mitigations or workarounds.

Please provide enough information to reproduce and assess the issue, but avoid accessing, copying, or disclosing other people's private data.

## 3. Responsible Disclosure

Please allow the project maintainer a reasonable opportunity to investigate and address a reported vulnerability before publicly disclosing it.

The maintainer will assess the report, investigate the issue, and determine appropriate remediation and disclosure steps.

Do not assume a specific response or resolution timeline unless one has been explicitly communicated.

## 4. Security Considerations

Contributors should take particular care with the following areas.

### Filesystem and Media Access

- Validate source and destination paths.
- Prevent unintended writes, overwrites, and path traversal.
- Avoid exposing private file paths or media metadata unnecessarily.
- Handle symbolic links and filesystem edge cases safely where relevant.
- Do not access or modify files outside the intended scope of an operation.

### Android Device Access

- Respect Android device authorization and access controls.
- Target the device explicitly selected by the user.
- Handle disconnected, unauthorized, and unavailable devices safely.
- Do not bypass device security controls or execute unintended device operations.

### Backup and Cleanup

- Preserve original media during backup operations.
- Distinguish copying from verified backup completion.
- Require explicit confirmation for destructive operations.
- Ensure dry-run operations do not perform the data-changing actions they preview.
- Avoid deleting files when their identity, backup status, or deletion safety is uncertain.
- Handle partial failures and cancellation without misleading the user about the outcome.

### Dependencies and Command Execution

- Validate external command arguments and avoid unsafe shell interpolation.
- Prefer established APIs and safe argument passing over constructing shell commands from untrusted input.
- Review dependency changes and avoid unnecessary packages.
- Handle missing tools and unexpected command output safely.

### Credentials and Sensitive Information

- Never commit passwords, access tokens, private keys, or other secrets.
- Do not include credentials or sensitive personal information in logs, test fixtures, issue reports, or documentation.
- Keep private release and publishing information out of public repository content.
- Use appropriate secret-management mechanisms if future integrations require credentials.

## 5. Security Expectations for Contributors

Contributors should:

- Consider security implications when proposing or implementing changes.
- Add tests for relevant security boundaries and failure cases.
- Avoid weakening validation, authorization, confirmation, or safety checks without a justified and reviewed design change.
- Review changes for accidental disclosure of secrets or personal information.
- Report suspected vulnerabilities privately rather than embedding sensitive details in a public pull request.

AI coding agents must follow `AGENTS.md`, inspect relevant security constraints, and obtain required approval before making security-sensitive changes.

## 6. Security Updates

Security fixes may be released as appropriate to the severity and impact of the issue.

Users should use trusted project release channels and review release notes for relevant security information.

Specific supported-version policies, response targets, and disclosure timelines will be documented here if and when the project establishes them.

## 7. Out of Scope

This policy does not authorize security testing against systems, devices, accounts, or data that you do not own or have explicit permission to test.

Do not conduct testing that risks data loss, unauthorized access, or exposure of private information.

Thank you for helping keep MediaSync CLI and its users' media safe.