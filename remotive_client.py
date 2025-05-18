import urllib.request
import urllib.parse
import json
import logging
from typing import List, Optional, Union

# Configure basic logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

REMOTE_JOBS_API_URL = "https://remotive.com/api/remote-jobs"

def fetch_raw_jobs(category: str = None, search_term: str = None, limit: int = None) -> Union[List, None]:
    """
    Fetches raw job listings from the Remotive API.

    Args:
        category: Optional. The job category to filter by (e.g., "software-dev").
        search_term: Optional. A search term to filter job titles and descriptions.
        limit: Optional. The maximum number of job listings to return.

    Returns:
        A list of job dictionaries if successful, None otherwise.
        Prints error messages to logging.
    """
    params = {}
    if category:
        params['category'] = category
    if search_term:
        params['search'] = search_term
    if limit is not None:
        params['limit'] = str(limit) # API expects limit as a string if passed as param

    query_string = urllib.parse.urlencode(params)
    request_url = f"{REMOTE_JOBS_API_URL}?{query_string}" if query_string else REMOTE_JOBS_API_URL

    logging.info(f"Fetching jobs from: {request_url}")

    try:
        # Create a Request object with headers
        req = urllib.request.Request(
            url=request_url,
            headers={
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.45 Safari/537.36',
                'Accept': 'application/json',
            }
        )
        
        with urllib.request.urlopen(req, timeout=10) as response: # Added a timeout
            if response.status == 200:
                data = response.read().decode('utf-8')
                parsed_json = json.loads(data)
                
                # The API wraps jobs in a 'jobs' key
                if 'jobs' in parsed_json:
                    return parsed_json['jobs']
                else:
                    logging.warning("'jobs' key not found in API response.")
                    # The API also includes a "0-legal-notice" key at the top level
                    # It could be that the response is valid but just doesn't have jobs
                    # e.g. if limit=0 or no jobs match search
                    if "0-legal-notice" in parsed_json: 
                        return [] # Return empty list if it's a valid Remotive response without jobs
                    return None
            else:
                logging.error(f"Failed to fetch jobs. Status code: {response.status} - {response.reason}")
                return None
    except urllib.error.HTTPError as e:
        logging.error(f"HTTPError while fetching jobs: {e.code} {e.reason}")
        return None
    except urllib.error.URLError as e:
        logging.error(f"URLError while fetching jobs: {e.reason}")
        return None
    except json.JSONDecodeError as e:
        logging.error(f"Failed to decode JSON response: {e}")
        return None
    except Exception as e:
        logging.error(f"An unexpected error occurred: {e}")
        return None

if __name__ == '__main__':
    # Example usage:
    logging.info("--- Fetching all available (default limit by API) software development jobs ---")
    swe_jobs = fetch_raw_jobs(category="software-dev")
    if swe_jobs is not None:
        logging.info(f"Found {len(swe_jobs)} software development jobs.")
        #for job in swe_jobs[:2]: # Print first 2 jobs
        #    print(json.dumps(job, indent=2))
    else:
        logging.info("Could not retrieve software development jobs.")

    logging.info("\n--- Fetching jobs with a search term 'python' and limit 5 ---")
    python_jobs = fetch_raw_jobs(search_term="python", limit=5)
    if python_jobs is not None:
        logging.info(f"Found {len(python_jobs)} jobs matching 'python' (limit 5).")
        # for job in python_jobs:
        #     print(json.dumps(job, indent=2))
    else:
        logging.info("Could not retrieve jobs for 'python'.")

    logging.info("\n--- Fetching with category and search ---")
    specific_jobs = fetch_raw_jobs(category="design", search_term="ui", limit=3)
    if specific_jobs is not None:
        logging.info(f"Found {len(specific_jobs)} design jobs with 'ui' (limit 3).")
    else:
        logging.info("Could not retrieve specific design jobs.")
    
    logging.info("\n--- Test fetching with limit 0 (should return empty list) ---")
    zero_limit_jobs = fetch_raw_jobs(limit=0)
    if zero_limit_jobs is not None:
        logging.info(f"Found {len(zero_limit_jobs)} jobs with limit 0.")
    else:
        logging.info("Could not retrieve jobs with limit 0.")
    
    logging.info("\n--- Test fetching with a non-existent category (should return empty list) ---")
    non_existent_category_jobs = fetch_raw_jobs(category="nonexistentcategory123")
    if non_existent_category_jobs is not None:
        logging.info(f"Found {len(non_existent_category_jobs)} jobs with non-existent category.")
    else:
        logging.info("Could not retrieve jobs with non-existent category.") 