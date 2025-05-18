import logging
import os

# Configure basic logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# Attempt to import necessary functions from our modules
try:
    from remotive_client import fetch_raw_jobs
    from job_processor import process_api_jobs, Job # Import Job if needed for type hinting, though not strictly used here
    from job_storage import save_jobs_to_json, load_jobs_from_json # load_jobs might be useful for more complex updates later
except ImportError as e:
    logging.critical(f"Failed to import necessary modules: {e}. Ensure remotive_client.py, job_processor.py, and job_storage.py are accessible.")
    # Exit if core components are missing, as the script cannot function
    exit(1)

# Define the path for the jobs data file
DATA_DIR = "data"
JOBS_JSON_FILEPATH = os.path.join(DATA_DIR, "remotive_jobs.json")

def run_update(fetch_category: str = None, fetch_search_term: str = None, fetch_limit: int = None):
    """
    Fetches the latest jobs from Remotive API, processes them, 
    and saves them to the JSON data store, overwriting the existing file.
    
    Args:
        fetch_category: Optional category to filter jobs by.
        fetch_search_term: Optional search term to filter jobs by.
        fetch_limit: Optional limit for the number of jobs to fetch.
    """
    logging.info("Starting job update process...")

    # Ensure data directory exists
    try:
        if not os.path.exists(DATA_DIR):
            os.makedirs(DATA_DIR)
            logging.info(f"Created data directory: {DATA_DIR}")
    except OSError as e:
        logging.error(f"Could not create data directory {DATA_DIR}: {e}")
        return # Cannot proceed without data directory

    # 1. Fetch raw jobs from the API
    logging.info(f"Fetching raw jobs from Remotive API (Category: {fetch_category}, Search: {fetch_search_term}, Limit: {fetch_limit})...")
    raw_jobs = fetch_raw_jobs(category=fetch_category, search_term=fetch_search_term, limit=fetch_limit)

    if raw_jobs is None:
        logging.error("Failed to fetch raw jobs from the API. The existing job data file will not be modified.")
        return # Exit if API fetch failed, do not overwrite with empty or old data
    
    logging.info(f"Successfully fetched {len(raw_jobs)} raw job listings from the API.")

    # 2. Process the raw jobs
    if not raw_jobs: # API returned an empty list (e.g. no jobs for query, or limit=0)
        logging.info("API returned an empty list of jobs. The job data file will be updated with an empty list.")
        processed_jobs = []
    else:
        logging.info("Processing raw job listings...")
        processed_jobs = process_api_jobs(raw_jobs)
        logging.info(f"Successfully processed {len(processed_jobs)} job listings.")

    # 3. Save the processed jobs to the JSON file (overwrite strategy)
    logging.info(f"Saving processed jobs to {JOBS_JSON_FILEPATH}...")
    save_success = save_jobs_to_json(processed_jobs, JOBS_JSON_FILEPATH)

    if save_success:
        logging.info(f"Job update process completed successfully. {len(processed_jobs)} jobs saved.")
    else:
        logging.error("Failed to save processed jobs to the JSON file.")

if __name__ == '__main__':
    logging.info("Executing job update script.")
    # Example: Fetch all software development jobs (Remotive API might have its own default limit)
    # run_update(fetch_category="software-dev")
    
    # Example: Fetch all jobs (no specific category, default API limit)
    run_update()

    # Example: To test loading, you could add:
    # print("\n--- Verifying by loading back --- ")
    # loaded_jobs_after_update = load_jobs_from_json(JOBS_JSON_FILEPATH)
    # print(f"Loaded {len(loaded_jobs_after_update)} jobs from {JOBS_JSON_FILEPATH} after update.")
    # if loaded_jobs_after_update:
    # print(f"First loaded job title: {loaded_jobs_after_update[0].title}") 