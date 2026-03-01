# Salary Proxy Backend

A simple Express backend to proxy College Scorecard API requests for top jobs/salaries by major.

## Setup

1. Copy `.env.example` to `.env` and add your College Scorecard API key:
   
   COLLEGE_SCORECARD_API_KEY=your_api_key_here
   PORT=4000

2. Install dependencies:

   npm install

3. Start the server:

   npm start

## Usage

- Endpoint: `GET /api/salary?cip=11.0701`
  - `cip` is the CIP code for the major (e.g., 11.0701 for Computer Science)
  - Returns top 5 institutions by median earnings for that major

## Notes
- This backend is for demo purposes and does not include job title mapping or growth rates.
- Extend as needed for your application.
