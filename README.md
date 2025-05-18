# Remotive Jobs Integration

A simple application to fetch, store, and display remote job listings from the Remotive API.

## Features

- Fetches remote job listings from the [Remotive API](https://remotive.com/api/remote-jobs)
- Processes and stores job data in a JSON file
- Displays job listings in a clean, simple web interface
- Complies with Remotive API terms (attribution and rate limits)

## Project Structure

- `remotive_client.py`: Handles API communication with Remotive
- `job_processor.py`: Processes raw API data into structured Job objects
- `job_storage.py`: Manages saving/loading job data to/from JSON
- `update_jobs.py`: Script to fetch, process and save the latest jobs
- `app.py`: Flask web application to display the jobs
- `templates/jobs.html`: HTML template for job listings (auto-generated if missing)

## Setup

1. Clone this repository:
   ```
   git clone [repository-url]
   cd [repository-directory]
   ```

2. Create and activate a virtual environment (optional but recommended):
   ```
   python -m venv venv
   
   # On Windows
   venv\Scripts\activate
   
   # On macOS/Linux
   source venv/bin/activate
   ```

3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

## Usage

### Fetching Job Data

Before starting the web application, you need to fetch job data from the Remotive API:

```
python update_jobs.py
```

This will:
- Create a `data` directory (if it doesn't exist)
- Fetch job listings from the Remotive API
- Process the data
- Save it as `data/remotive_jobs.json`

### Running the Web Application

Start the Flask web application:

```
python app.py
```

The app will be available at [http://127.0.0.1:5000](http://127.0.0.1:5000)

### Keeping Data Updated

To keep job listings up-to-date, run `update_jobs.py` periodically. This can be done:

1. Manually as needed
2. Using a task scheduler:
   - **cron** (Linux/macOS): Add an entry to run a few times per day
   - **Task Scheduler** (Windows): Set a recurring task

Example cron entry to run 4 times per day:
```
0 */6 * * * cd /path/to/project && /path/to/python update_jobs.py
```

## Customizations

### Filtering Jobs

You can modify `update_jobs.py` to fetch specific types of jobs:

```python
# Fetch only software development jobs
run_update(fetch_category="software-dev")

# Fetch jobs with a specific search term
run_update(fetch_search_term="python")

# Fetch a limited number of jobs
run_update(fetch_limit=50)
```

Available categories can be found at `https://remotive.com/api/remote-jobs/categories`

### Modifying the UI

The job listing appearance can be modified by editing `templates/jobs.html` after it's generated.

## Remotive API Terms

Please note these API usage terms:

- API requests should be limited (max 2 per minute, and they suggest max 4 per day)
- The application must include attribution to Remotive as the source
- Links to original job postings on Remotive must be included

## Future Enhancements

- Add support for multiple job API sources
- Implement filtering and search in the UI
- Add job detail pages
- Enhance the design and responsiveness # atlas
