# Atlas Job Finder

A web application designed to fetch, process, and display remote job listings. This project uses Python scripts to gather data from the Remotive API and a Next.js frontend to present the jobs to the user in a modern, responsive interface.

## Features

- Fetches remote job listings from the [Remotive API](https://remotive.com/api/remote-jobs)
- Modern and responsive user interface built with Next.js, React, and Tailwind CSS
- Python scripts for robust data fetching, processing, and storage
- Integration with Supabase for potential backend services (e.g., user accounts, saved jobs - based on dependencies)
- Potential for MongoDB integration for data storage (based on dependencies)
- Complies with Remotive API terms (attribution and rate limits)

## Tech Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Backend Services / Data**: Supabase, MongoDB (based on dependencies)
- **Data Fetching/Processing**: Python
  - Key Python libraries: Flask (as per `requirements.txt`, though specific use needs verification - potentially for `app.py`), `requests` (implied for API calls, should be added to `requirements.txt`).
- **Primary API Source**: [Remotive API](https://remotive.com/api/remote-jobs)

## Project Structure

```
AtlasV2/
├── app/                  # Next.js 13+ app directory (pages, layouts, API routes)
├── components/           # Reusable React components
├── contexts/             # React context providers
├── lib/                  # Frontend utility functions, client-side libraries
├── public/               # Static assets (images, fonts, etc.)
├── scripts/              # Python scripts for data operations
│   ├── update_jobs.py    # Main script to fetch, process, and save job data
│   ├── remotive_client.py # Handles API communication with Remotive
│   ├── job_processor.py  # Processes raw API data
│   └── job_storage.py    # Manages saving/loading job data (e.g., to JSON)
├── data/                 # (Typically) Stores fetched job data (e.g., remotive_jobs.json)
├── types/                # TypeScript type definitions
├── .env.local.example    # Example environment variables file
├── next.config.js        # Next.js configuration
├── package.json          # Frontend dependencies and scripts
├── tsconfig.json         # TypeScript configuration
├── app.py                # Original Flask application (role may have evolved)
├── requirements.txt      # Python dependencies
└── README.md             # This file
```

## Getting Started

### Prerequisites

- Node.js (LTS version, e.g., v18 or v20 recommended)
- Python (v3.8+ recommended)
- npm or yarn

### 1. Clone the Repository

```bash
git clone [your-repository-url]
cd AtlasV2
```

### 2. Backend/Data Fetching Setup (Python)

These scripts are responsible for fetching job data.

a. **Create and activate a Python virtual environment:**
*(Optional but recommended)*

```bash
python -m venv venv
# On Windows
# venv\Scripts\activate
# On macOS/Linux
source venv/bin/activate
```

b. **Install Python dependencies:**
It's recommended to add `requests` and any other necessary libraries to `requirements.txt`.

```bash
pip install -r requirements.txt
# Example: pip install requests # if not in requirements.txt
```

c. **Run the job update script:**
This script will create a `data` directory (if it doesn't exist) and populate `data/remotive_jobs.json` (or similar, depending on `job_storage.py` logic).

```bash
python scripts/update_jobs.py
```
*(Adjust path if `update_jobs.py` is not in a `scripts` subdirectory or if current directory is not project root)*

### 3. Frontend Setup (Next.js)

a. **Install Node.js dependencies:**

```bash
npm install
# or
# yarn install
```

b. **Set up environment variables:**
Create a `.env.local` file in the root of the project by copying `.env.local.example` (if it exists, otherwise create it).
Populate it with necessary environment variables:

```env
# Example .env.local
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Add any other variables required by the application (e.g., MongoDB URI, API keys for other services)
```

c. **Run the development server:**

```bash
npm run dev
```
The application should now be running at [http://localhost:3000](http://localhost:3000).

## Available Scripts

### Frontend (package.json)

- `npm run dev`: Starts the Next.js development server.
- `npm run build`: Builds the Next.js application for production.
- `npm run start`: Starts the Next.js production server.
- `npm run lint`: Lints the Next.js codebase using ESLint.

### Backend (Python)

- `python scripts/update_jobs.py`: Fetches the latest job listings from the Remotive API, processes them, and saves them (e.g., to `data/remotive_jobs.json`).
  - **Customizations**: You might be able to modify `scripts/update_jobs.py` to fetch specific job categories, search terms, or limit the number of jobs, similar to the original README's guidance. Check the script for details.
  ```python
  # Example modifications within update_jobs.py (refer to actual script)
  # run_update(fetch_category="software-dev")
  # run_update(fetch_search_term="python")
  # run_update(fetch_limit=50)
  ```

## Data Management & Updates

The `scripts/update_jobs.py` script is crucial for keeping the job data fresh.

### Keeping Data Updated

To keep job listings current, run `scripts/update_jobs.py` periodically. This can be done:

1. Manually as needed.
2. Using a task scheduler:
   - **cron** (Linux/macOS): Add an entry to run a few times per day.
   - **Task Scheduler** (Windows): Set a recurring task.

Example cron entry to run, for instance, 4 times per day (adjust paths and frequency as needed):

```cron
0 */6 * * * cd /path/to/your/AtlasV2 && /path/to/your/venv/bin/python scripts/update_jobs.py
```
*(Ensure the Python interpreter path is correct, especially if using a virtual environment).*

## Remotive API Terms of Service

This project utilizes the Remotive API. Please adhere to their terms:
- **Rate Limiting**: API requests should be limited (e.g., Remotive suggests max 2 per minute for their free tier and advises infrequent updates like 4 times per day).
- **Attribution**: The application must provide attribution to Remotive as the data source.
- **Direct Links**: Include links to the original job postings on Remotive.

## Original Flask Application (`app.py`)

The project contains an `app.py`, which appears to be the original Flask web application for displaying jobs. Its current role alongside the Next.js application should be clarified. It might serve as:
- A legacy component.
- A direct API for the Next.js app (though Next.js API routes are more common for this).
- A standalone tool for quick data viewing.

If still in use, it can typically be run via:
```bash
python app.py
```
And would be available at `http://127.0.0.1:5000`.

## Future Enhancements (Ideas)

- Full Supabase integration for user accounts, saved jobs, and preferences.
- Advanced search and filtering capabilities in the UI (e.g., by tags, salary range, company).
- Detailed job view pages.
- Admin panel for managing data sources or site settings.
- Integration of additional job APIs.
- Automated testing for both frontend and backend components.

## Contributing

(Details about how to contribute to the project, if open to contributions.)

## License

(Specify the project's license, e.g., MIT License.)
