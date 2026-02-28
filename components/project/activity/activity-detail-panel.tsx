"use client";

import { useQuery } from "@tanstack/react-query";
import {
	CalendarIcon,
	CompassIcon,
	Plus,
	RefreshCw,
	Trash2,
	UserIcon,
	X,
} from "lucide-react";
import { useParams } from "next/navigation";
import { Panel } from "@/components/core/panel";
import { UserAvatar } from "@/components/core/user-avatar";
import { SpinnerWithSpacing } from "@/components/core/loaders";
import {
	formatEventTypeLabel,
	getEventDescription,
} from "@/lib/activity/message";
import { guessTimezone } from "@/lib/utils/date";
import { useTRPCClient } from "@/trpc/client";

function getActionIcon(action: string) {
	switch (action) {
		case "created":
			return { icon: Plus, color: "text-emerald-500", bg: "bg-emerald-500/10" };
		case "updated":
			return {
				icon: RefreshCw,
				color: "text-amber-500",
				bg: "bg-amber-500/10",
			};
		case "deleted":
			return { icon: Trash2, color: "text-red-500", bg: "bg-red-500/10" };
		default:
			return {
				icon: RefreshCw,
				color: "text-muted-foreground",
				bg: "bg-muted",
			};
	}
}

function formatLocalTime(date: Date, timeZone: string): string {
	return date.toLocaleString("en-US", {
		timeZone,
		day: "numeric",
		month: "long",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
		hour12: true,
	});
}

function formatUTCTime(date: Date): string {
	return date.toLocaleString("en-US", {
		timeZone: "UTC",
		day: "numeric",
		month: "long",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
		hour12: true,
	});
}

function SectionLabel({
	icon: Icon,
	label,
}: { icon: React.ElementType; label: string }) {
	return (
		<div className="flex items-center gap-2 mb-3">
			<div className="p-1.5 rounded-full bg-muted">
				<Icon className="h-4 w-4 text-muted-foreground" />
			</div>
			<h3 className="font-semibold text-sm">{label}</h3>
		</div>
	);
}

function DataRow({ label, value }: { label: string; value: string }) {
	return (
		<div className="flex gap-4 px-4 py-2.5 border-b last:border-b-0">
			<span className="text-sm font-medium text-muted-foreground min-w-16 shrink-0">
				{label}
			</span>
			<span className="text-sm font-mono break-all">{value}</span>
		</div>
	);
}

export function ActivityDetailPanel({
	activityId,
	onClose,
}: {
	activityId: number;
	onClose: () => void;
}) {
	const { projectId } = useParams();
	const trpcClient = useTRPCClient();

	const { data: item, isPending } = useQuery({
		queryKey: ["projects", "getActivityById", activityId],
		queryFn: () =>
			trpcClient.projects.getActivityById.query({
				id: activityId,
				projectId: +projectId!,
			}),
	});

	const actionConfig = item ? getActionIcon(item.action) : null;
	const ActionIcon = actionConfig?.icon ?? RefreshCw;

	return (
		<Panel
			open={true}
			setOpen={(open) => {
				if (!open) onClose();
			}}
			title="Activity Details"
		>
			{isPending || !item ? (
				<SpinnerWithSpacing />
			) : (
				<>
					<div className="flex items-start justify-between p-4 border-b">
						<div className="flex items-start gap-3">
							<div className={`p-2 rounded-lg ${actionConfig?.bg}`}>
								<ActionIcon
									className={`h-5 w-5 ${actionConfig?.color}`}
								/>
							</div>
							<div>
								<h2 className="font-semibold text-lg">
									{formatEventTypeLabel(item.type, item.action)}
								</h2>
								<p className="text-sm text-muted-foreground mt-0.5">
									{getEventDescription(item.type, item.action)}
								</p>
							</div>
						</div>
						<button
							type="button"
							onClick={onClose}
							className="p-1 rounded-md hover:bg-muted transition-colors"
						>
							<X className="h-5 w-5 text-muted-foreground" />
						</button>
					</div>

					<div className="flex-1 overflow-y-auto p-4 space-y-6">
						<div className="rounded-lg border bg-muted/30 overflow-hidden">
							<DataRow
								label="Event ID"
								value={item.eventId || String(item.id)}
							/>
						</div>

						<div>
							<SectionLabel icon={CalendarIcon} label="When" />
							<div className="rounded-lg border overflow-hidden">
								<DataRow
									label="Local"
									value={formatLocalTime(
										new Date(item.createdAt),
										guessTimezone,
									)}
								/>
								<DataRow
									label="UTC"
									value={formatUTCTime(new Date(item.createdAt))}
								/>
								<DataRow
									label="ISO"
									value={new Date(item.createdAt).toISOString()}
								/>
							</div>
						</div>

						<div>
							<SectionLabel icon={UserIcon} label="Who" />
							<div className="rounded-lg border overflow-hidden">
								<div className="flex items-center gap-3 px-4 py-3 border-b">
									<UserAvatar
										user={item.actor}
										className="h-6 w-6"
									/>
									<div>
										<p className="text-sm font-medium">
											{item.actor.firstName || "Unknown"}
										</p>
										<p className="text-xs text-muted-foreground">
											{item.actor.email}
										</p>
									</div>
								</div>
								{item.metadata ? (
									<div className="p-4">
										<pre className="text-xs font-mono bg-muted p-3 rounded-md overflow-x-auto whitespace-pre-wrap">
											{JSON.stringify(
												{
													user: {
														id: item.actor.id,
														email: item.actor.email,
													},
													session: {
														id: (item.metadata as Record<string, unknown>)
															.sessionId,
														ipAddress: (
															item.metadata as Record<string, unknown>
														).ipAddress,
														userAgent: (
															item.metadata as Record<string, unknown>
														).userAgent,
													},
												},
												null,
												2,
											)}
										</pre>
									</div>
								) : null}
							</div>
						</div>

						<div>
							<SectionLabel icon={CompassIcon} label="What" />
							<div className="rounded-lg border overflow-hidden">
								{item.action === "updated" && item.oldValue ? (
									<>
										<div className="p-4 border-b">
											<p className="text-xs font-medium text-muted-foreground mb-2">
												Previous value
											</p>
											<pre className="text-xs font-mono bg-muted p-3 rounded-md overflow-x-auto whitespace-pre-wrap">
												{JSON.stringify(item.oldValue, null, 2)}
											</pre>
										</div>
										<div className="p-4">
											<p className="text-xs font-medium text-muted-foreground mb-2">
												New value
											</p>
											<pre className="text-xs font-mono bg-muted p-3 rounded-md overflow-x-auto whitespace-pre-wrap">
												{JSON.stringify(item.newValue, null, 2)}
											</pre>
										</div>
									</>
								) : (
									<div className="p-4">
										<pre className="text-xs font-mono bg-muted p-3 rounded-md overflow-x-auto whitespace-pre-wrap">
											{JSON.stringify(
												item.newValue || item.oldValue,
												null,
												2,
											)}
										</pre>
									</div>
								)}
							</div>
						</div>
					</div>
				</>
			)}
		</Panel>
	);
}
