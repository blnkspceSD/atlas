import json
import logging
from datetime import datetime
from typing import List, Dict, Optional, Union # Using List from typing for compatibility

# Attempt to import Job dataclass from job_processor
# This assumes job_processor.py is in the same directory or accessible via PYTHONPATH
try:
    from job_processor import Job
except ImportError:
    logging.error("Could not import Job from job_processor.py. Ensure it's in the same directory or PYTHONPATH.")
    # Define a placeholder if import fails, to allow script to be parsed, though it won't fully work.
    from dataclasses import dataclass
    @dataclass
    class Job:
        id: int
        title: str
        company_name: str
        remotive_url: str
        category: str
        publication_date: datetime # This will be problematic if Job isn't the real one
        description_html: str
        candidate_required_location: Optional[str] = None
        salary: Optional[str] = None
        job_type: Optional[str] = None

# Configure basic logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# Define the path for the jobs data file - for compatibility with app.py
import os
DATA_DIR = "data"
JOBS_JSON_FILEPATH = os.path.join(DATA_DIR, "remotive_jobs.json")

def save_jobs_to_json(jobs: List[Job], filepath: str) -> bool:
    """
    Saves a list of Job objects to a JSON file.
    Datetime objects are converted to ISO 8601 strings.

    Args:
        jobs: A list of Job dataclass objects.
        filepath: The path to the JSON file where jobs will be saved.
    
    Returns:
        True if saving was successful, False otherwise.
    """
    try:
        data_to_save = []
        for job in jobs:
            job_dict = {
                "id": job.id,
                "title": job.title,
                "company_name": job.company_name,
                "remotive_url": job.remotive_url,
                "category": job.category,
                "publication_date": job.publication_date.isoformat(), # Convert datetime to ISO string
                "description_html": job.description_html,
                "candidate_required_location": job.candidate_required_location,
                "salary": job.salary,
                "job_type": job.job_type
            }
            data_to_save.append(job_dict)
        
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(data_to_save, f, indent=4, ensure_ascii=False)
        logging.info(f"Successfully saved {len(jobs)} jobs to {filepath}")
        return True
    except IOError as e:
        logging.error(f"IOError saving jobs to {filepath}: {e}")
    except TypeError as e:
        logging.error(f"TypeError during JSON serialization (often datetime issues if not handled): {e}")
    except Exception as e:
        logging.error(f"An unexpected error occurred while saving jobs to {filepath}: {e}")
    return False

def load_jobs_from_json(filepath: str) -> List[Job]:
    """
    Loads a list of Job objects from a JSON file.
    ISO 8601 date strings are converted back to datetime objects.

    Args:
        filepath: The path to the JSON file from which jobs will be loaded.

    Returns:
        A list of Job dataclass objects. Returns an empty list if the file 
        doesn't exist, is empty, or cannot be parsed.
    """
    jobs = []
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            data_from_file = json.load(f)
            if not isinstance(data_from_file, list):
                logging.warning(f"JSON file {filepath} does not contain a list. Returning empty list.")
                return []

            for job_dict in data_from_file:
                try:
                    # Convert ISO string back to datetime
                    date_str = job_dict.get('publication_date')
                    parsed_date = None
                    if date_str:
                        try:
                            # datetime.fromisoformat is quite flexible
                            parsed_date = datetime.fromisoformat(date_str)
                        except ValueError as ve_date:
                            logging.warning(f"Could not parse date string '{date_str}' for job ID {job_dict.get('id')}: {ve_date}. Setting date to None.")
                            # Decide if jobs with unparseable dates should be skipped or have date set to None
                            # If Job dataclass requires publication_date, this will fail construction
                            # For now, let's assume Job dataclass requires it, so this job might be skipped by outer try-except.
                            # If Job.publication_date was Optional[datetime], we could set it to None.
                            # Given current Job definition, we need a valid datetime.
                            # To be robust, we might skip this job or use a placeholder if the date is critical
                            # For now, the outer exception will catch the issue if Job construction fails due to this.
                            # For the Job dataclass, publication_date is NOT optional.
                            pass # Let the Job construction fail if date is invalid and required
                    
                    # Ensure all required fields for Job dataclass are present
                    # This is a basic check; Pydantic would be more robust here.
                    if not all(k in job_dict for k in ['id', 'title', 'company_name', 'remotive_url', 'category', 'description_html']) or not parsed_date:
                        logging.warning(f"Skipping job from JSON due to missing required fields or unparseable date: {job_dict.get('id', 'Unknown ID')}")
                        continue

                    job = Job(
                        id=job_dict['id'],
                        title=job_dict['title'],
                        company_name=job_dict['company_name'],
                        remotive_url=job_dict['remotive_url'],
                        category=job_dict['category'],
                        publication_date=parsed_date, # Use the parsed date
                        description_html=job_dict['description_html'],
                        candidate_required_location=job_dict.get('candidate_required_location'),
                        salary=job_dict.get('salary'),
                        job_type=job_dict.get('job_type')
                    )
                    jobs.append(job)
                except KeyError as e:
                    logging.warning(f"Skipping job from JSON due to missing key: {e}. Data: {job_dict}")
                except TypeError as e: # Catches issues if parsed_date is None and Job expects datetime
                    logging.warning(f"Skipping job from JSON due to TypeError (likely bad date for required field): {e}. Data: {job_dict}")
                except Exception as e:
                    logging.error(f"Error processing a job record from {filepath}: {e}. Record: {job_dict}")

        logging.info(f"Successfully loaded {len(jobs)} jobs from {filepath}")
    except FileNotFoundError:
        logging.info(f"JSON file {filepath} not found. Returning empty list.")
    except json.JSONDecodeError as e:
        logging.error(f"Error decoding JSON from {filepath}: {e}. Returning empty list.")
    except Exception as e:
        logging.error(f"An unexpected error occurred while loading jobs from {filepath}: {e}")
    return jobs

if __name__ == '__main__':
    # This assumes job_processor.py (for Job dataclass) is accessible
    # Create some dummy Job objects for testing
    if 'Job' in globals() and hasattr(Job, 'title'): # Check if real Job class was imported
        test_jobs = [
            Job(id=1, title="Software Engineer", company_name="Tech Co", remotive_url="http://example.com/1", category="dev", publication_date=datetime(2023, 1, 15, 10, 30, 0), description_html="<p>Job 1</p>"),
            Job(id=2, title="Product Manager", company_name="Biz Inc", remotive_url="http://example.com/2", category="product", publication_date=datetime(2023, 1, 16, 14, 0, 0), description_html="<p>Job 2</p>", salary="$100k")
        ]
        test_filepath = "test_jobs.json"

        logging.info(f"--- Testing saving {len(test_jobs)} jobs to {test_filepath} ---")
        save_success = save_jobs_to_json(test_jobs, test_filepath)
        if save_success:
            logging.info(f"--- Testing loading jobs from {test_filepath} ---")
            loaded_jobs = load_jobs_from_json(test_filepath)
            if loaded_jobs:
                logging.info(f"Successfully loaded {len(loaded_jobs)} jobs.")
                for job in loaded_jobs:
                    print(f"Loaded Job: ID={job.id}, Title='{job.title}', Published='{job.publication_date.strftime('%Y-%m-%d %H:%M')}', Salary='{job.salary}'")
                
                # Verify data integrity (simple check)
                if len(loaded_jobs) == len(test_jobs) and loaded_jobs[0].title == test_jobs[0].title and loaded_jobs[0].publication_date == test_jobs[0].publication_date:
                    logging.info("Data integrity check passed.")
                else:
                    logging.error("Data integrity check FAILED.")
            else:
                logging.error("Failed to load jobs or file was empty after saving.")
        else:
            logging.error(f"Failed to save jobs to {test_filepath}.")
    else:
        logging.warning("Job dataclass not properly imported. Skipping job_storage.py tests.") 