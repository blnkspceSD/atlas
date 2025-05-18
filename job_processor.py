from dataclasses import dataclass, field
from datetime import datetime
import logging
from typing import Optional, List, Dict, Union # Changed from typing.Optional for newer Python versions

# Configure basic logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

@dataclass
class Job:
    id: int
    title: str
    company_name: str
    remotive_url: str
    category: str
    publication_date: datetime
    description_html: str
    candidate_required_location: Optional[str] = None
    salary: Optional[str] = None
    job_type: Optional[str] = None
    # company_logo: Optional[str] = None # Example of another optional field from API

def process_api_jobs(api_job_list: List[Dict]) -> List[Job]:
    """
    Processes a list of raw job dictionaries from the Remotive API
    and converts them into a list of structured Job objects.

    Args:
        api_job_list: A list of job dictionaries from fetch_raw_jobs.

    Returns:
        A list of Job dataclass objects.
    """
    processed_jobs = []
    if not api_job_list:
        return processed_jobs

    for raw_job in api_job_list:
        try:
            # Ensure required fields are present
            if not all(k in raw_job for k in ['id', 'title', 'company_name', 'url', 'category', 'publication_date', 'description']):
                logging.warning(f"Skipping job due to missing required fields: {raw_job.get('id', 'Unknown ID')}")
                continue

            # Convert publication_date string to datetime object
            # The API format is like "2023-10-26T10:00:00"
            # Sometimes it might have milliseconds or 'Z' for UTC, robust parsing is good.
            date_str = raw_job['publication_date']
            try:
                # Attempt to parse with 'Z' if present, then try without
                # Python's fromisoformat handles 'Z' as UTC correctly since 3.11
                # For broader compatibility, replace 'Z' if older Python or handle explicitly
                if date_str.endswith('Z'):
                    parsed_date = datetime.fromisoformat(date_str.replace('Z', '+00:00'))
                else:
                    parsed_date = datetime.fromisoformat(date_str)
            except ValueError as ve_date:
                logging.warning(f"Could not parse date string '{date_str}' for job ID {raw_job['id']}: {ve_date}. Skipping date.")
                # Fallback or skip job if date is crucial and unparseable
                # For now, let's make it a required field, so if it fails, we skip the job or handle as an error.
                # Alternatively, set publication_date to None or a default if it's optional in your model.
                logging.warning(f"Skipping job ID {raw_job['id']} due to unparseable publication_date.")
                continue
            
            job = Job(
                id=raw_job['id'],
                title=raw_job['title'],
                company_name=raw_job['company_name'],
                remotive_url=raw_job['url'], # Mapping 'url' from API to 'remotive_url'
                category=raw_job['category'],
                publication_date=parsed_date,
                description_html=raw_job['description'], # Storing HTML as is for now
                candidate_required_location=raw_job.get('candidate_required_location'),
                salary=raw_job.get('salary'),
                job_type=raw_job.get('job_type')
                # company_logo=raw_job.get('company_logo')
            )
            processed_jobs.append(job)
        except KeyError as e:
            logging.warning(f"Skipping job due to missing key: {e}. Raw job data: {raw_job}")
        except Exception as e:
            logging.error(f"An unexpected error occurred while processing job ID {raw_job.get('id', 'Unknown ID')}: {e}")
            # Depending on severity, you might want to re-raise or just skip the job
    
    return processed_jobs

if __name__ == '__main__':
    # This requires remotive_client.py to be in the same directory or Python path
    try:
        from remotive_client import fetch_raw_jobs
    except ImportError:
        logging.error("remotive_client.py not found. Place it in the same directory or ensure it's in PYTHONPATH.")
        fetch_raw_jobs = None # To prevent NameError later

    if fetch_raw_jobs:
        logging.info("--- Testing job_processor with live data from remotive_client ---")
        
        # Example 1: Fetch a few software development jobs
        sample_raw_jobs = fetch_raw_jobs(category="software-dev", limit=3)
        if sample_raw_jobs is not None:
            logging.info(f"Fetched {len(sample_raw_jobs)} raw jobs for processing.")
            processed_jobs_list = process_api_jobs(sample_raw_jobs)
            logging.info(f"Successfully processed {len(processed_jobs_list)} jobs.")
            for job_item in processed_jobs_list:
                print(f"Processed Job: ID={job_item.id}, Title='{job_item.title}', Published='{job_item.publication_date.strftime('%Y-%m-%d')}'")
        else:
            logging.warning("Could not fetch sample raw jobs to process.")

        # Example 2: Test with an empty list
        logging.info("\n--- Testing with an empty list of raw jobs ---")
        empty_processed_list = process_api_jobs([])
        logging.info(f"Processed {len(empty_processed_list)} jobs from empty list (expected 0).")

        # Example 3: Test with malformed data (simulated)
        logging.info("\n--- Testing with some malformed job data ---")
        malformed_raw_jobs = [
            {'id': 1, 'title': 'Good Job', 'company_name': 'Company A', 'url': 'http://example.com/1', 'category': 'dev', 'publication_date': '2023-01-01T12:00:00', 'description': '<p>Desc</p>'},
            {'id': 2, 'title': 'Job missing URL'}, # Missing 'url' and other required fields
            {'id': 3, 'title': 'Job with bad date', 'company_name': 'Company C', 'url': 'http://example.com/3', 'category': 'design', 'publication_date': 'invalid-date-format', 'description': '<p>Desc</p>'},
            {'id': 4, 'company_name': 'Company D', 'url': 'http://example.com/4', 'category': 'product', 'publication_date': '2023-01-04T12:00:00', 'description': '<p>Desc</p>'} # Missing 'title'
        ]
        processed_malformed_list = process_api_jobs(malformed_raw_jobs)
        logging.info(f"Processed {len(processed_malformed_list)} jobs from malformed list (expected 1 good job).")
        for job_item in processed_malformed_list:
            print(f"Processed (malformed test) Job: ID={job_item.id}, Title='{job_item.title}'") 