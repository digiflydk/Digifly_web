import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  getCaseById,
  updateCase,
  deleteCase as deleteCaseServer,
} from "@/lib/cms-api";

type RouteCtx = { params: Promise<{ param: string }> };

const UpdateCaseSchema = z.object({
  title: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),
  excerpt: z.string().optional(),
  content: z.any().optional(),
  coverImage: z
    .object({
      url: z.string().url(),
      alt: z.string().optional(),
    })
    .optional(),
  tags: z.array(z.string()).optional(),
  published: z.boolean().optional(),
  sortOrder: z.number().optional(),
});

/**
 * GET /api/cms/cases/[param]
 * Returns a single case by id or slug (backend handles lookup).
 */
export async function GET(_req: NextRequest, ctx: RouteCtx) {
  const { param } = await ctx.params;
  try {
    const item = await getCaseById(param);
    if (!item) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(item, { status: 200 });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/cms/cases/[param]
 * Updates a single case. Body must match UpdateCaseSchema (partial allowed).
 */
export async function PUT(req: NextRequest, ctx: RouteCtx) {
  const { param } = await ctx.params;
  try {
    const json = await req.json();
    const data = UpdateCaseSchema.parse(json);
    const updated = await updateCase(param, data as any);
    return NextResponse.json(updated, { status: 200 });
  } catch (err: unknown) {
    if (err && typeof err === "object" && "issues" in (err as any)) {
      // zod error
      return NextResponse.json({ error: (err as any).issues }, { status: 400 });
    }
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/cms/cases/[param]
 * Deletes a single case.
 */
export async function DELETE(_req: NextRequest, ctx: RouteCtx) {
  const { param } = await ctx.params;
  try {
    await deleteCaseServer(param);
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
