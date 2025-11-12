
"use server";
import { updateHomepage } from "@/lib/server/cms-actions";
import { revalidatePath } from "next/cache";
import type { HomePage } from "@/lib/types";

export async function saveHomepageAction(data: HomePage) {
  const result = await updateHomepage(data);
  revalidatePath("/", "layout");
  revalidatePath("/dadmin/homepage");
  return result;
}
