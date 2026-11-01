export const contactSubjects = [
  "",
  "AI og automatisering",
  "Digitalt produkt",
  "Systemimplementering og integrationer",
  "Udviklingskapacitet",
  "Lagerstyring",
  "Omnichannel",
  "monday.com",
  "Fondsresearch",
  "Retail-labels og markedsresearch",
] as const;

export function isContactSubject(
  value: unknown,
): value is (typeof contactSubjects)[number] {
  return (
    typeof value === "string" &&
    contactSubjects.some((subject) => subject === value)
  );
}
