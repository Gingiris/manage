import { headers } from "next/headers";
import { activity } from "@/drizzle/schema";
import { auth } from "@/lib/auth";
import { database } from "../utils/useDatabase";
import { getOwner } from "../utils/useOwner";

type GenericObject = {
	[key: string]:
		| string
		| number
		| boolean
		| Date
		| null
		| undefined
		| unknown
		| GenericObject;
};

export async function logActivity({
	action,
	type,
	oldValue,
	newValue,
	target,
	projectId,
}: {
	action: "created" | "updated" | "deleted";
	type: "tasklist" | "task" | "project" | "blob" | "event" | "comment" | "post";
	oldValue?: GenericObject;
	newValue?: GenericObject;
	target?: string;
	projectId: number;
}) {
	const db = await database();
	const { userId } = await getOwner();

	const reqHeaders = await headers();
	const ipAddress =
		reqHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() ||
		reqHeaders.get("x-real-ip") ||
		null;
	const userAgent = reqHeaders.get("user-agent") || null;

	let sessionId: string | null = null;
	let userEmail: string | null = null;
	try {
		const session = await auth.api.getSession({ headers: reqHeaders });
		sessionId = session?.session?.id || null;
		userEmail = session?.user?.email || null;
	} catch {}

	const metadata = {
		ipAddress,
		userAgent,
		sessionId,
		userEmail,
	};

	await db
		.insert(activity)
		.values({
			eventId: crypto.randomUUID(),
			action,
			type,
			oldValue,
			newValue,
			metadata,
			target,
			projectId,
			userId,
		})
		.execute();
}
