import { ActivityIcon, Plus, RefreshCw, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

function CreatedIcon({ className }: { className?: string }) {
	return (
		<div className={cn("rounded-lg shrink-0 p-1.5 bg-emerald-500/10", className)}>
			<Plus className="h-4 w-4 text-emerald-500" />
		</div>
	);
}

function UpdatedIcon({ className }: { className?: string }) {
	return (
		<div className={cn("rounded-lg shrink-0 p-1.5 bg-amber-500/10", className)}>
			<RefreshCw className="h-4 w-4 text-amber-500" />
		</div>
	);
}

function DeletedIcon({ className }: { className?: string }) {
	return (
		<div className={cn("rounded-lg shrink-0 p-1.5 bg-red-500/10", className)}>
			<Trash2 className="h-4 w-4 text-red-500" />
		</div>
	);
}

function DefaultIcon({ className }: { className?: string }) {
	return (
		<div className={cn("rounded-lg shrink-0 p-1.5 bg-muted", className)}>
			<ActivityIcon className="h-4 w-4 text-muted-foreground" />
		</div>
	);
}

export function ActionIcon({
	action,
	className,
}: {
	action: string;
	className?: string;
}) {
	switch (action) {
		case "created":
			return <CreatedIcon className={className} />;
		case "updated":
			return <UpdatedIcon className={className} />;
		case "deleted":
			return <DeletedIcon className={className} />;
		default:
			return <DefaultIcon className={className} />;
	}
}
