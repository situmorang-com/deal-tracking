import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export type WithElementRef<T> = T & { ref?: HTMLElement | null };
export type WithoutChildrenOrChild<T> = Omit<T, 'children' | 'child'>;

export function generateId(): string {
	return Math.random().toString(36).substr(2, 9);
}

export function formatDate(date: string | Date): string {
	const d = new Date(date);
	return d.toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'short',
		day: 'numeric'
	});
}

export function formatRelativeTime(date: string | Date): string {
	const d = new Date(date);
	const now = new Date();
	const diffInMs = now.getTime() - d.getTime();
	const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

	if (diffInDays === 0) {
		return 'Today';
	} else if (diffInDays === 1) {
		return '1 day ago';
	} else if (diffInDays < 7) {
		return `${diffInDays} days ago`;
	} else if (diffInDays < 30) {
		const weeks = Math.floor(diffInDays / 7);
		return weeks === 1 ? '1 week ago' : `${weeks} weeks ago`;
	} else if (diffInDays < 365) {
		const months = Math.floor(diffInDays / 30);
		return months === 1 ? '1 month ago' : `${months} months ago`;
	} else {
		const years = Math.floor(diffInDays / 365);
		return years === 1 ? '1 year ago' : `${years} years ago`;
	}
}