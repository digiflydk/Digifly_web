
import { redirect } from "next/navigation";

// This is a permanent redirect to the new canonical path.
export default function Page() {
  redirect("/dadmin/tests");
}
