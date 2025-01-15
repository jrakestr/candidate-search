import { useState, useEffect } from "react";
import { searchGithub, searchGithubUser } from "../api/API";
import { Candidate } from "../interfaces/Candidate.interface";

// TODO: Implement the CandidateSearch component using the Candidate interface
const CandidateSearch = () => {
	const [currentCandidate, setCurrentCandidate] = useState<Candidate | null>(
		null
	);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [isLoadingNext, setIsLoadingNext] = useState(false);

	// Import necessary hooks and API functions
	// Load next candidate
	const loadNextCandidate = async () => {
		try {
			setIsLoadingNext(true);
			setError(null);
			const users = await searchGithub();

			if (!users || users.length === 0) {
				setError("No more candidates available");
				setCurrentCandidate(null);
				return;
			}

			// Try each user in the list until we find one that exists
			for (const user of users) {
				try {
					const detailedUser = await searchGithubUser(user.login);
					if (detailedUser && detailedUser.login) {
						setCurrentCandidate(detailedUser);
						return;
					}
				} catch (err) {
					// If this user wasn't found, continue to the next one
					if (err instanceof Error && err.message.includes("Not Found")) {
						continue;
					}
					// For other errors, throw them to be caught by outer catch
					throw err;
				}
			}

			// If we get here, none of the users were valid
			throw new Error("No valid candidates found. Please try again.");
		} catch (err) {
			setError(err instanceof Error ? err.message : "Error loading candidate");
			setCurrentCandidate(null);
		} finally {
			setLoading(false);
			setIsLoadingNext(false);
		}
	};

	// Save candidate to localStorage with validation
	const saveCandidate = async () => {
		if (!currentCandidate) return;

		try {
			const savedCandidates = JSON.parse(
				localStorage.getItem("savedCandidates") || "[]"
			);

			// Check if candidate is already saved
			if (
				savedCandidates.some((c: Candidate) => c.id === currentCandidate.id)
			) {
				setError("Candidate already saved");
				return;
			}

			savedCandidates.push(currentCandidate);
			localStorage.setItem("savedCandidates", JSON.stringify(savedCandidates));

			// Load next candidate after successful save
			await loadNextCandidate();
		} catch (err) {
			setError("Failed to save candidate");
		}
	};

	// Initial load
	useEffect(() => {
		loadNextCandidate();
	}, []);

	// Loading states
	if (loading && !currentCandidate) {
		return (
			<div className="loading-container">
				<h1>Candidate Search</h1>
				<div className="loading">Loading initial candidate...</div>
			</div>
		);
	}

	// Error states
	if (error && !currentCandidate) {
		return (
			<div className="error-container">
				<h1>Candidate Search</h1>
				<div className="error">
					<p>{error}</p>
					<button onClick={loadNextCandidate}>Try Again</button>
				</div>
			</div>
		);
	}

	// No candidates state
	if (!currentCandidate) {
		return (
			<div className="no-candidates">
				<h1>Candidate Search</h1>
				<p>No more candidates available at this time.</p>
				<button onClick={loadNextCandidate}>Refresh Search</button>
			</div>
		);
	}

	return (
		<div className="candidate-search">
			<h1>Candidate Search</h1>
			{error && <div className="error-message">{error}</div>}
			<div className="candidate-card">
				<img
					src={currentCandidate.avatar_url}
					alt={`${currentCandidate.login}'s avatar`}
					className="candidate-avatar"
				/>
				<div className="candidate-info">
					<h2>{currentCandidate.name || currentCandidate.login}</h2>
					<p>Username: {currentCandidate.login}</p>
					<p>Location: {currentCandidate.location || "Not specified"}</p>
					<p>Email: {currentCandidate.email || "Not specified"}</p>
					<p>Company: {currentCandidate.company || "Not specified"}</p>
					<a
						href={currentCandidate.html_url}
						target="_blank"
						rel="noopener noreferrer"
					>
						View GitHub Profile
					</a>
				</div>
				<div className="candidate-actions">
					<button
						onClick={saveCandidate}
						className="accept-btn"
						disabled={isLoadingNext}
					>
						+
					</button>
					<button
						onClick={loadNextCandidate}
						className="reject-btn"
						disabled={isLoadingNext}
					>
						-
					</button>
				</div>
			</div>
			{isLoadingNext && (
				<div className="loading-next">Loading next candidate...</div>
			)}
		</div>
	);
};

export default CandidateSearch;
