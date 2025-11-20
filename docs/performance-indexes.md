# Firestore Performance & Indexes

This document outlines the required Firestore indexes for the Digifly Studio application to ensure optimal query performance.

## 1. Why Indexes Are Necessary

Firestore automatically creates single-field indexes, which handle simple queries. However, for more complex queries that involve filtering on multiple fields and ordering the results, a **composite index** must be created manually.

If a required index is missing, Firestore will reject the query and return an error. The error message often includes a direct link to the Firebase Console to create the exact index needed.

## 2. Required Composite Indexes

The following indexes are required by the application and must be defined in the `firestore.indexes.json` file in the project root.

### `qaRuns` Collection

- **Purpose**: This index is used by the `/dadmin/developer/tests` page to fetch and display the most recent test runs for a specific acceptance suite.
- **Query**: Filters by `runType` and `suiteId`, and orders by `startedAt` in descending order.
- **Index Definition**:
  ```json
  {
    "collectionGroup": "qaRuns",
    "queryScope": "COLLECTION",
    "fields": [
      { "fieldPath": "runType", "order": "ASCENDING" },
      { "fieldPath": "suiteId", "order": "ASCENDING" },
      { "fieldPath": "startedAt", "order": "DESCENDING" }
    ]
  }
  ```

### `cases` Collection

- **Purpose**: This index is used by `getCaseBySlug()` to efficiently look up a case study document using its URL slug.
- **Query**: Filters by `slug`.
- **Index Definition**: Although Firestore creates single-field indexes automatically, explicitly defining it is good practice.
  ```json
  {
    "collectionGroup": "cases",
    "queryScope": "COLLECTION",
    "fields": [
      { "fieldPath": "slug", "order": "ASCENDING" }
    ]
  }
  ```

### `auditLogs` Collection

- **Purpose**: Used by the `/dadmin/developer/logs` page to fetch the latest audit log entries.
- **Query**: Orders by `ts` (timestamp) in descending order.
- **Index Definition**:
  ```json
  {
    "collectionGroup": "auditLogs",
    "queryScope": "COLLECTION",
    "fields": [
      { "fieldPath": "ts", "order": "DESCENDING" }
    ]
  }
  ```

## 3. How to Add a New Index

1.  When a query fails in development due to a missing index, copy the creation link from the error message in your browser's developer console.
2.  Open the link in your browser and create the index in the Firebase Console. It may take a few minutes to build.
3.  Once the index is built, **copy the index definition** from the console into the `firestore.indexes.json` file.
4.  Commit the updated `firestore.indexes.json` file to your repository. This ensures the index will be automatically deployed in all environments.
