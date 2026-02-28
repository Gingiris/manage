"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { ActivityIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { parseAsInteger, useQueryState } from "nuqs";
import { useMemo } from "react";
import Markdown from "react-markdown";
import { Spinner, SpinnerWithSpacing } from "@/components/core/loaders";
import { UserAvatar } from "@/components/core/user-avatar";
import { Button } from "@/components/ui/button";
import type { ActivityWithActor } from "@/drizzle/types";
import {
	formatEventTypeLabel,
	generateObjectDiffMessage,
	getActionIcon,
} from "@/lib/activity/message";
import { guessTimezone, toDateTimeString } from "@/lib/utils/date";
import { useTRPCClient } from "@/trpc/client";
import { ActivityDetailPanel } from "./activity-detail-panel";

const ACTIVITIES_LIMIT = 25;

export function ActivityItem({
	item,
	onSelect,
}: { item: ActivityWithActor; onSelect: (id: number) => void }) {
	const actionConfig = getActionIcon(item.action);
	const ActionIcon = actionConfig.icon;

	return (
		<button
			type="button"
			onClick={() => onSelect(item.id)}
			className="w-full text-left py-4 px-4 hover:bg-muted/40 rounded-lg transition-colors cursor-pointer"
		>
			<div className="flex items-start gap-3">
				<div className={`p-1.5 mt-0.5 shrink-0 ${actionConfig.containerClassName}`}>
					<ActionIcon className={actionConfig.iconClassName} />
				</div>

				<div className="flex-1 min-w-0">
					<div className="flex items-center justify-between gap-2">
						<span className="text-xs text-muted-foreground">
							{toDateTimeString(
								new Date(item.createdAt),
								guessTimezone,
							)}
						</span>
					</div>

					<div className="mt-1">
						<span className="font-semibold text-sm">
							{formatEventTypeLabel(item.type, item.action)}
						</span>
					</div>

					<div className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
						<Markdown
							components={{
								p: ({ children }) => (
									<span className="leading-relaxed">{children}</span>
								),
								strong: ({ children }) => (
									<strong className="font-semibold text-foreground">
										{children}
									</strong>
								),
							}}
						>
							{generateObjectDiffMessage(item)}
						</Markdown>
						<span className="text-muted-foreground mx-1">by</span>
						<UserAvatar
							user={item.actor}
							className="h-5 w-5 inline-block"
						/>
						<span className="text-sm font-medium text-foreground">
							{item.actor.firstName || item.actor.email}
						</span>
					</div>
				</div>
			</div>
		</button>
	);
}

export function ActivityFeed() {
	const { projectId } = useParams();
	const trpcClient = useTRPCClient();
	const [selectedActivityId, setSelectedActivityId] = useQueryState(
		"activity",
		parseAsInteger,
	);

	const {
		data: activitiesData,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		isPending,
	} = useInfiniteQuery({
		queryKey: ["projects", "getActivities", +projectId!],
		queryFn: async ({ pageParam }) => {
			return await trpcClient.projects.getActivities.query({
				projectId: +projectId!,
				offset: pageParam,
			});
		},
		initialPageParam: 0,
		getNextPageParam: (lastPage, allPages) => {
			if (lastPage.length < ACTIVITIES_LIMIT) return undefined;
			return allPages.length * ACTIVITIES_LIMIT;
		},
	});

	const activities = useMemo(() => {
		return activitiesData?.pages.flat() ?? [];
	}, [activitiesData]);

	if (isPending) {
		return <SpinnerWithSpacing />;
	}

	return (
		<div className="flex flex-col w-full">
			{activities.length ? (
				<>
					<div className="divide-y divide-border">
						{activities.map((activityItem) => (
							<ActivityItem
								key={activityItem.id}
								item={activityItem}
								onSelect={(id) => setSelectedActivityId(id)}
							/>
						))}
					</div>

					<div className="flex justify-center p-4 mt-2">
						{isFetchingNextPage ? (
							<Spinner className="mx-auto" />
						) : hasNextPage ? (
							<Button
								onClick={() => fetchNextPage()}
								variant="outline"
								size="sm"
								className="w-full max-w-xs"
							>
								Load more activities
							</Button>
						) : (
							<span className="text-xs text-muted-foreground">
								End of activity
							</span>
						)}
					</div>
				</>
			) : (
				<div className="flex flex-col items-center justify-center py-16 px-4 text-center">
					<div className="rounded-full bg-muted p-4">
						<ActivityIcon className="h-8 w-8 text-muted-foreground" />
					</div>
					<h3 className="mt-4 font-semibold text-foreground">
						No activity yet
					</h3>
					<p className="mt-1 text-sm text-muted-foreground max-w-xs">
						Activity will appear here as you and your team make changes to
						this project.
					</p>
				</div>
			)}

			{selectedActivityId && (
				<ActivityDetailPanel
					activityId={selectedActivityId}
					onClose={() => setSelectedActivityId(null)}
				/>
			)}
		</div>
	);
}
