
import { NextResponse } from "next/server";
import { getHomepage, getNavigation, getSiteSettings } from "@/lib/cms-server";

export const runtime = "nodejs";

export async function GET() {
  try {
    const [homepageResult, navigation, siteSettings] = await Promise.all([
      getHomepage(),
      getNavigation(),
      getSiteSettings(),
    ]);

    // Extract data, using defaults on failure for robustness
    const homepage = homepageResult.ok ? homepageResult.data : homepageResult;

    const payload = {
      meta: {
        generatedAt: new Date().toISOString(),
        source: "digifly-cms-dump",
        version: process.env.NEXT_PUBLIC_APP_VERSION || "unknown"
      },
      cms: {
        homepage,
        navigation,
        siteSettings,
      },
    };

    return NextResponse.json(payload, {
      headers: {
        "Content-Disposition": 'attachment; filename="digifly-cms-dump.json"',
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("[Developer CMS Dump] Failed to export JSON", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return new NextResponse(`Failed to export CMS JSON: ${errorMessage}`, { status: 500 });
  }
}
