import { RichTextContent } from "@/lib/types";
import { Check } from "lucide-react";

type RichTextProps = {
    content?: RichTextContent[] | null;
    className?: string;
}

export function RichText({ content, className }: RichTextProps) {
    const nodes = content ?? [];
    if (nodes.length === 0) {
        return null;
    }

    return (
        <div className={`prose prose-lg max-w-none text-foreground/90 leading-relaxed ${className}`}>
            {nodes.map((block, index) => {
                switch (block.type) {
                    case 'p':
                        return <p key={index}>{block.text}</p>;
                    case 'list':
                        return (
                            <ul key={index} className="space-y-3 !pl-0">
                                {block.items.map((item, i) => (
                                    <li key={i} className="flex items-start">
                                        <span className="mr-3 mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                                            <Check className="h-4 w-4" />
                                        </span>
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        );
                    default:
                        return null;
                }
            })}
        </div>
    )
}
export default RichText;