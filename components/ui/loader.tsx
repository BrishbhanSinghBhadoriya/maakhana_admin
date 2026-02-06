import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export interface LoaderProps extends React.HTMLAttributes<HTMLDivElement> {
    size?: number;
}

export function Loader({ className, size = 24, ...props }: LoaderProps) {
    return (
        <div className={cn("flex justify-center items-center w-full h-full", className)} {...props}>
            <Loader2 className="animate-spin text-primary" size={size} />
        </div>
    );
}
