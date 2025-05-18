from flask import Flask, render_template
import logging
import os
import re

# Configure basic logging (optional for a simple Flask app, but good practice)
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# Attempt to import job_storage
try:
    from job_storage import load_jobs_from_json, JOBS_JSON_FILEPATH # Assuming JOBS_JSON_FILEPATH is defined in job_storage
except ImportError:
    logging.error("Could not import from job_storage.py. Ensure it's accessible.")
    # Fallback if job_storage is not found or JOBS_JSON_FILEPATH isn't there.
    # This allows the Flask app to at least start, though it won't show jobs.
    def load_jobs_from_json(filepath): return []
    JOBS_JSON_FILEPATH = "data/remotive_jobs.json" # Default path


app = Flask(__name__)

# Function to format salary with commas
def format_salary_filter(salary):
    if not salary:
        return "Salary not specified"
    
    # Replace numbers with commas (e.g., 100000 -> 100,000)
    return re.sub(r'\b(\d{4,})\b', lambda match: re.sub(r'\B(?=(\d{3})+(?!\d))', ',', match.group(0)), salary)

# Register the filter with Jinja2
app.jinja_env.filters['format_salary'] = format_salary_filter

# Ensure the JOBS_JSON_FILEPATH is using the one from update_jobs.py structure
# If job_storage.py doesn't expose it, we define it here consistent with update_jobs.py
if 'JOBS_JSON_FILEPATH' not in globals() or globals()['JOBS_JSON_FILEPATH'] is None:
    DATA_DIR = "data"
    JOBS_JSON_FILEPATH = os.path.join(DATA_DIR, "remotive_jobs.json")


@app.route('/')
def list_jobs():
    """
    Main route to display job listings.
    Loads job data from the JSON file and passes it to the template.
    """
    logging.info(f"Attempting to load jobs from: {JOBS_JSON_FILEPATH}")
    
    # Check if the JSON file exists before trying to load
    if not os.path.exists(JOBS_JSON_FILEPATH):
        logging.warning(f"Jobs data file not found at {JOBS_JSON_FILEPATH}. Displaying empty job list.")
        logging.warning("Please run the update_jobs.py script to fetch and store job data.")
        jobs = []
        file_error = f"Job data file not found. Please run 'python update_jobs.py' to populate it."
    else:
        jobs = load_jobs_from_json(JOBS_JSON_FILEPATH)
        file_error = None
        if not jobs and os.path.exists(JOBS_JSON_FILEPATH):
             logging.info(f"Loaded jobs from {JOBS_JSON_FILEPATH}, but the list is empty or an error occurred during loading (check logs).")
        elif jobs:
             logging.info(f"Successfully loaded {len(jobs)} jobs for display.")


    # The 'jobs' variable (a list of Job objects) and 'file_error' will be available in jobs.html
    return render_template('jobs.html', jobs=jobs, file_error=file_error)

if __name__ == '__main__':
    # Creates the 'templates' directory if it doesn't exist, as Flask expects it.
    if not os.path.exists('templates'):
        os.makedirs('templates')
        logging.info("Created 'templates' directory.")
    
    # Check if the jobs.html template exists, and create a placeholder if not.
    if not os.path.exists('templates/jobs.html'):
        placeholder_html = """
<!doctype html>
<html lang=\"en\">
<head>
    <meta charset=\"utf-8\">
    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">
    <title>Remote Jobs</title>
    <style>
        body { font-family: sans-serif; margin: 20px; background-color: #f4f4f4; color: #333; }
        .container { max-width: 900px; margin: auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
        h1 { color: #333; text-align: center; }
        .job-card { border: 1px solid #ddd; padding: 15px; margin-bottom: 15px; border-radius: 5px; background-color: #fff; }
        .job-card h2 { margin-top: 0; color: #007bff; }
        .job-card p { margin: 5px 0; }
        .job-card .company { font-weight: bold; }
        .job-card .date { font-size: 0.9em; color: #666; }
        .job-card .source-link { display: block; margin-top: 10px; font-size: 0.9em; }
        .error-message { color: red; text-align: center; padding: 20px; background-color: #ffecec; border: 1px solid red; border-radius: 5px; }
        .empty-message { text-align: center; padding: 20px; background-color: #e9ecef; border: 1px solid #ced4da; border-radius: 5px; }
    </style>
</head>
<body>
    <div class=\"container\">
        <h1>Job Listings</h1>
        {% if file_error %}
            <p class=\"error-message\">{{ file_error }}</p>
        {% elif jobs %}
            {% for job in jobs %}
                <div class=\"job-card\">
                    <h2>{{ job.title }}</h2>
                    <p><span class=\"company\">{{ job.company_name }}</span> - <span>{{ job.category }}</span></p>
                    <p class=\"date\">Published: {{ job.publication_date.strftime('%Y-%m-%d') }}</p>
                    {% if job.candidate_required_location %}
                        <p>Location: {{ job.candidate_required_location }}</p>
                    {% endif %}
                    {% if job.salary %}
                        <p>Salary: {{ job.salary }}</p>
                    {% endif %}
                    <!-- <p>Description: {{ job.description_html | safe | truncate(200) }}</p> -->
                    <a href=\"{{ job.remotive_url }}\" target=\"_blank\" class=\"source-link\">View on Remotive (Source)</a>
                </div>
            {% endfor %}
        {% else %}
            <p class=\"empty-message\">No jobs found. Try running the update script or check the source file.</p>
        {% endif %}
    </div>
</body>
</html>
"""
        with open('templates/jobs.html', 'w') as f:
            f.write(placeholder_html)
        logging.info("Created placeholder 'templates/jobs.html'.")

    app.run(debug=True) # debug=True is good for development 