# Digifly CMS Admin Guide

This document explains how to manage site content using the built-in CMS interface.

## Accessing the Admin Panel

The admin panel is available at `/admin`. To access it, you must provide a secret token in the URL.

- **URL:** `https://<your-site-url>/admin?token=<YOUR_ADMIN_TOKEN>`

Replace `<YOUR_ADMIN_TOKEN>` with the value of the `ADMIN_TOKEN` environment secret configured in your Firebase App Hosting environment.

If the token is incorrect or missing, you will see an "Unauthorized" message.

## Managing Content

The admin panel is organized into tabs, allowing you to edit different parts of the site.

### 1. Brand & Appearance
- **Logo URL:** The URL for your company's logo (SVG or PNG recommended).
- **Favicon URL:** The URL for your site's favicon (e.g., a `.ico` or `.png` file).
- **Brand Colors:** Set the primary, accent, and background colors for the site.
- **Typography:** Define the fonts used for headlines and body text. These should be names of fonts available via Google Fonts.

### 2. Page Content (Home, Services, etc.)
Each page tab allows you to edit the specific text and content blocks for that page.
- **Titles & Subtitles:** Main headings for each section.
- **Body Content:** Paragraphs or lists of features.
- **CTA Buttons:** The text and link for call-to-action buttons.

## How it Works

- **Saving:** When you click "Save Changes," the form data is sent to a secure server-side API endpoint (`/api/cms/admin/...`).
- **Authentication:** The API endpoint is protected and requires the `X-Admin-Token` header, which is automatically sent by the admin panel.
- **Data Storage:** All content is stored in your project's Firestore database under the `content` collection.
- **Live Updates:** Changes are reflected on the live site immediately after saving, without needing to redeploy. The public-facing pages read data from a cached API, which updates periodically.

## Environment Variables

- `ADMIN_TOKEN`: A strong, random string used to secure the admin panel and API. This must be configured as a secret in your Firebase App Hosting environment.
- `FIREBASE_SERVICE_ACCOUNT_JSON`: Your Firebase service account key (JSON format), required for the admin API to write to Firestore.
