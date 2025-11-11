
import Link from "next/link";
import { Button, type ButtonProps } from "@/components/ui/button";

type Props = ButtonProps & {
  href: string;
  target?: string;
  rel?: string;
  children: React.ReactNode;
};

export default function ButtonLink({ href, target, rel, children, ...btnProps }: Props) {
  return (
    <Link href={href} target={target} rel={rel} passHref>
      <Button {...btnProps}>{children}</Button>
    </Link>
  );
}
