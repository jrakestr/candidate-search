// TODO: Create an interface for the Candidate objects returned by the API
export interface Candidate {
	// Required fields from acceptance criteria
	name: string | null; // Full name
	login: string; // GitHub username
	location: string | null; // Geographic location
	avatar_url: string; // Profile picture URL
	email: string | null; // Email address
	html_url: string; // GitHub profile URL
	company: string | null; // Company affiliation

	// Need ID for unique identification in the application
	id: number; // Unique identifier
}
