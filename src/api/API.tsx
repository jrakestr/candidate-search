// Types for API responses
interface RateLimitResponse {
	resources: {
		core: {
			limit: number;
			remaining: number;
			reset: number;
		};
	};
}

// Check GitHub API rate limit
const checkRateLimit = async (): Promise<RateLimitResponse | null> => {
	try {
		// Debug log to check if token is being read
		console.log("Token exists:", !!import.meta.env.VITE_GITHUB_TOKEN);

		const response = await fetch("https://api.github.com/rate_limit", {
			headers: {
				Authorization: `Bearer ${import.meta.env.VITE_GITHUB_TOKEN}`,
			},
		});
		if (!response.ok) {
			throw new Error("Failed to check rate limit");
		}
		return await response.json();
	} catch (err) {
		console.error("Rate limit check failed:", err);
		return null;
	}
};

const searchGithub = async () => {
	try {
		// Check rate limit before making the request
		const rateLimit = await checkRateLimit();
		if (rateLimit?.resources.core.remaining === 0) {
			const resetTime = new Date(
				rateLimit.resources.core.reset * 1000
			).toLocaleTimeString();
			throw new Error(`API rate limit exceeded. Resets at ${resetTime}`);
		}

		const start = Math.floor(Math.random() * 100000000) + 1;
		const response = await fetch(
			`https://api.github.com/users?since=${start}`,
			{
				headers: {
					Authorization: `Bearer ${import.meta.env.VITE_GITHUB_TOKEN}`,
				},
			}
		);

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(errorData.message || "Failed to fetch users");
		}

		const data = await response.json();
		return data;
	} catch (err) {
		console.error("Search error:", err);
		throw err; // Re-throw to handle in the component
	}
};

const searchGithubUser = async (username: string) => {
	try {
		// Check rate limit before making the request
		const rateLimit = await checkRateLimit();
		if (rateLimit?.resources.core.remaining === 0) {
			const resetTime = new Date(
				rateLimit.resources.core.reset * 1000
			).toLocaleTimeString();
			throw new Error(`API rate limit exceeded. Resets at ${resetTime}`);
		}

		const response = await fetch(`https://api.github.com/users/${username}`, {
			headers: {
				Authorization: `Bearer ${import.meta.env.VITE_GITHUB_TOKEN}`,
			},
		});

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(errorData.message || `Failed to fetch user ${username}`);
		}

		const data = await response.json();
		return data;
	} catch (err) {
		console.error("User search error:", err);
		throw err; // Re-throw to handle in the component
	}
};

export { searchGithub, searchGithubUser };
