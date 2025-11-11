# Release Checklist

Follow these steps to ensure a safe and stable deployment.

### 1. Run Pre-deploy QA (Locally)

- **Navigate** to your project root in the terminal.
- **Run** the command: `npm run predeploy`
- **Wait** for the run to complete. It will print a success or failure message.

### 2. Review the Report

- The command will generate an HTML report in the `playwright-report/` directory.
- Open this report and **verify** that all checks are green (passed).
- If any checks are red (failed):
    - **Do not proceed.**
    - Open the failed test and read the error message.
    - Create a new ticket (e.g., in your project management tool) to fix the issue.
    - Paste the check name and error details into the ticket.

### 3. Build

- Once all pre-deploy checks are green, trigger a build in your CI/CD environment (e.g., by pushing to the main branch).
- The `npm run build` command will execute.

### 4. Deploy

- The CI/CD pipeline will automatically deploy the build to Firebase App Hosting after a successful build.

### 5. Smoke Test Live

- After the deployment is complete, visit the live URL.
- Perform a quick manual check of the homepage and one other key page to ensure everything appears as expected.
