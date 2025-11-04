// This is a mock CMS API. In a real application, this would be replaced
// with calls to a headless CMS like Firestore, Contentful, etc.

import type { DesignSettings, Navigation, HomePage, CaseDoc, Page } from './types';
import * as data from './cms-data';

const MOCK_API_DELAY = 100; // ms

const simulateDelay = () => new Promise(resolve => setTimeout(resolve, MOCK_API_DELAY));

export async function getDesignSettings(): Promise<DesignSettings> {
  await simulateDelay();
  return data.designSettings;
}

export async function getNavigation(): Promise<Navigation> {
  await simulateDelay();
  return data.navigation;
}

export async function getHomePage(): Promise<HomePage> {
  await simulateDelay();
  return data.homePage;
}

export async function getCases(): Promise<CaseDoc[]> {
  await simulateDelay();
  return data.cases;
}

export async function getCaseBySlug(slug: string): Promise<CaseDoc | null> {
  await simulateDelay();
  const items = await getCases();
  return items.find(c => c.slug === slug) ?? null;
}

export async function getAboutPage() {
    await simulateDelay();
    return data.aboutPage;
}

export async function getServicesPage() {
    await simulateDelay();
    return data.servicesPage;
}

export async function getCasesIndexPage() {
    await simulateDelay();
    return data.casesIndexPage;
}

export async function getContactPage() {
    await simulateDelay();
    return data.contactPage;
}
