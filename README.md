# GitHub Candidate Search

A React application that helps you discover and save potential GitHub candidates for recruitment. Built with React, TypeScript, and Vite.

## Features

- Search through GitHub users and view their profiles
- Quick accept/reject interface for efficient candidate review
- Save interesting candidates for later review
- Persistent storage of saved candidates
- Detailed profile information including:
  - Name and username
  - Location
  - Profile picture
  - Email
  - GitHub URL
  - Company

## Setup

1. Clone this repository
2. Install dependencies:

```bash
npm install
```

3. Create a GitHub Personal Access Token:

   - Go to GitHub Settings → Developer Settings → Personal Access Tokens → Fine-grained tokens
   - Generate a new token (no additional permissions needed)
   - Copy your token immediately after creation

4. Set up your environment:

   - Create a `.env` file in the environment folder
   - Add your token: `VITE_GITHUB_TOKEN=your_token_here`

5. Start the development server:

```bash
npm run dev
```

## Deployment

This application can be deployed to Render. Make sure to:

- Configure your environment variables in Render's dashboard
- Add `VITE_GITHUB_TOKEN` with your GitHub token

## Tech Stack

- React
- TypeScript
- Vite
- GitHub REST API
- Local Storage for data persistence

## Contributing

Feel free to submit issues and pull requests to help improve this project.

## License

© 2024 edX Boot Camps LLC. Confidential and Proprietary. All Rights Reserved.
