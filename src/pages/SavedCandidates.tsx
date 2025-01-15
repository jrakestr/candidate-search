import { useState, useEffect } from "react";
import { Candidate } from "../interfaces/Candidate.interface";

// TODO: Implement the SavedCandidates component using the Candidate interface
const SavedCandidates = () => {
	const [savedCandidates, setSavedCandidates] = useState<Candidate[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	// Load saved candidates from localStorage with error handling
	const loadSavedCandidates = () => {
		try {
			setLoading(true);
			const savedData = localStorage.getItem("savedCandidates");

			if (!savedData) {
				setSavedCandidates([]);
				return;
			}

			const candidates = JSON.parse(savedData);

			// Validate the data structure
			if (!Array.isArray(candidates)) {
				throw new Error("Invalid saved candidates data");
			}

			// Validate each candidate has required fields
			const validCandidates = candidates.filter((candidate: any) => {
				return (
					candidate &&
					candidate.id &&
					candidate.login &&
					candidate.avatar_url &&
					candidate.html_url
				);
			});

			setSavedCandidates(validCandidates);
		} catch (err) {
			setError("Error loading saved candidates");
			setSavedCandidates([]);
		} finally {
			setLoading(false);
		}
	};

	// Remove a candidate from saved list
	const removeCandidate = (candidateId: number) => {
		try {
			const updatedCandidates = savedCandidates.filter(
				(candidate) => candidate.id !== candidateId
			);
			localStorage.setItem(
				"savedCandidates",
				JSON.stringify(updatedCandidates)
			);
			setSavedCandidates(updatedCandidates);
		} catch (err) {
			setError("Failed to remove candidate");
		}
	};

	// Load candidates on mount and setup storage event listener
	useEffect(() => {
		loadSavedCandidates();

		// Listen for changes from other tabs/windows
		const handleStorageChange = (event: StorageEvent) => {
			if (event.key === "savedCandidates") {
				loadSavedCandidates();
			}
		};

		window.addEventListener("storage", handleStorageChange);
		return () => window.removeEventListener("storage", handleStorageChange);
	}, []);

	// Loading state
	if (loading) {
		return (
			<div className="loading-container">
				<h1>Potential Candidates</h1>
				<div className="loading">Loading saved candidates...</div>
			</div>
		);
	}

	// Error state
	if (error) {
		return (
			<div className="error-container">
				<h1>Potential Candidates</h1>
				<div className="error">
					<p>{error}</p>
					<button onClick={loadSavedCandidates}>Try Again</button>
				</div>
			</div>
		);
	}

	// No candidates state
	if (savedCandidates.length === 0) {
		return (
			<div className="saved-candidates">
				<h1>Potential Candidates</h1>
				<p className="no-candidates-message">
					No candidates have been accepted yet.
				</p>
			</div>
		);
	}

	// Main render that displays the saved candidates, shows list of previously saved candidatees, and persists data through page reloads
	return (
		// Container for the saved candidates
		<div className="saved-candidates">
			<h1>Potential Candidates</h1>
			{/* Candidates grid */}
			<div className="candidates-grid">
				{/* Map over saved candidates and display each candidate card */}
				{savedCandidates.map((candidate) => (
					<div key={candidate.id} className="candidate-card">
						<img
							src={candidate.avatar_url}
							alt={`${candidate.login}'s avatar`}
							className="candidate-avatar"
						/>
						{/* Candidate info */}
						<div className="candidate-info">
							<h2>{candidate.name || candidate.login}</h2>
							<p>Username: {candidate.login}</p>
							<p>Location: {candidate.location || "Not specified"}</p>
							<p>Email: {candidate.email || "Not specified"}</p>
							<p>Company: {candidate.company || "Not specified"}</p>
							{/* GitHub profile link */}
							<a
								href={candidate.html_url}
								target="_blank"
								rel="noopener noreferrer"
							>
								View GitHub Profile
							</a>
							<button
								onClick={() => removeCandidate(candidate.id)}
								className="remove-btn"
								aria-label="Remove candidate"
							>
								Remove
							</button>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default SavedCandidates;
