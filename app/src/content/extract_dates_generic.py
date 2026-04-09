#!/usr/bin/env python3

import os
import re
import json
from datetime import datetime

def extract_date_from_html(html_file, url=""):
    """Extract the publication date from HTML files using multiple patterns."""
    try:
        with open(html_file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # SE Radio pattern: <span class="updated">June 27, 2017</span>
        se_pattern = r'<span class="updated">([^<]+)</span>'
        se_match = re.search(se_pattern, content)
        
        if se_match:
            date_str = se_match.group(1).strip()
            return parse_date_string(date_str, html_file)
        
        # Manager Tools pattern: <source src="https://files.manager-tools.com/private/podcast/mp3/manager-tools-2019-10-07.mp3"
        mt_pattern = r'manager-tools-(\d{4}-\d{2}-\d{2})\.mp3'
        mt_match = re.search(mt_pattern, content)
        
        if mt_match:
            date_str = mt_match.group(1)
            print(f"  Found Manager Tools date: {date_str}")
            return date_str
        
        # SFELC pattern (may be challenging due to obfuscated CSS classes)
        # Look for patterns around the date like "Sep 14, 2021"
        sfelc_pattern1 = r'(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+(\d{1,2}),\s+(\d{4})'
        sfelc_match1 = re.search(sfelc_pattern1, content)
        
        if sfelc_match1:
            month_abbr = sfelc_match1.group(1)
            day = sfelc_match1.group(2).zfill(2)  # Pad with zero if needed
            year = sfelc_match1.group(3)
            
            # Convert month abbreviation to number
            month_map = {
                'Jan': '01', 'Feb': '02', 'Mar': '03', 'Apr': '04',
                'May': '05', 'Jun': '06', 'Jul': '07', 'Aug': '08',
                'Sep': '09', 'Oct': '10', 'Nov': '11', 'Dec': '12'
            }
            month = month_map.get(month_abbr, '01')
            
            date_str = f"{year}-{month}-{day}"
            print(f"  Found SFELC date: {date_str}")
            return date_str
        
        print(f"Warning: No date found in {html_file}")
        return None
        
    except Exception as e:
        print(f"Error reading {html_file}: {e}")
        return None

def parse_date_string(date_str, filename=""):
    """Parse various date string formats into YYYY-MM-DD."""
    # Parse various date formats
    date_formats = [
        "%B %d, %Y",  # January 15, 2020
        "%b %d, %Y",  # Jan 15, 2020
        "%B %d %Y",   # January 15 2020
        "%b %d %Y"    # Jan 15 2020
    ]
    
    for fmt in date_formats:
        try:
            date_obj = datetime.strptime(date_str, fmt)
            return date_obj.strftime("%Y-%m-%d")
        except ValueError:
            continue
    
    print(f"Warning: Could not parse date '{date_str}' from {filename}")
    return date_str  # Return original if can't parse

def extract_all_manager_tools_urls():
    """Extract all Manager Tools URLs from JSON files."""
    urls = []
    json_files = ['people.json', 'engineering.json', 'business.json', 'ai.json', 'history.json']
    
    for json_file in json_files:
        try:
            with open(json_file, 'r', encoding='utf-8') as f:
                data = json.load(f)
                
            # Extract URLs from the data structure
            for category_name, items in data.items():
                for item in items:
                    url = item.get('url', '')
                    if 'manager-tools.com' in url:
                        urls.append(url)
                        
        except FileNotFoundError:
            print(f"Warning: {json_file} not found")
        except json.JSONDecodeError:
            print(f"Warning: {json_file} has invalid JSON")
    
    return list(set(urls))  # Remove duplicates

def generate_filename_from_url(url):
    """Generate filename using the same logic as download-url.py."""
    # Remove protocol and www prefix for cleaner filename
    clean_url = url.replace('https://', '').replace('http://', '').replace('www.', '')
    
    # Get unique characters while preserving order
    from collections import OrderedDict
    unique_chars = list(OrderedDict.fromkeys(char for char in clean_url if char.isalnum()))
    
    # Take first 10 and last 10 unique characters
    if len(unique_chars) <= 20:
        filename_base = ''.join(unique_chars)
    else:
        filename_base = ''.join(unique_chars[:10] + unique_chars[-10:])
    
    return f"{filename_base}.html"

def extract_all_dates_from_urls(urls):
    """Extract dates from HTML files for given URLs."""
    url_to_date = {}
    
    print(f"Extracting dates for {len(urls)} URLs...")
    
    for url in urls:
        filename = generate_filename_from_url(url)
        print(f"Processing {url} -> {filename}")
        
        if os.path.exists(filename):
            date = extract_date_from_html(filename, url)
            if date:
                url_to_date[url] = date
                print(f"  Date: {date}")
            else:
                print(f"  No date found")
        else:
            print(f"  File {filename} not found")
    
    return url_to_date

def main():
    """Main function to extract all Manager Tools dates."""
    # Get all Manager Tools URLs
    manager_tools_urls = extract_all_manager_tools_urls()
    print(f"Found {len(manager_tools_urls)} Manager Tools URLs")
    
    # Extract dates
    url_to_date = extract_all_dates_from_urls(manager_tools_urls)
    
    print(f"\nExtracted {len(url_to_date)} dates:")
    for url, date in sorted(url_to_date.items()):
        print(f"  {url} -> {date}")
    
    return url_to_date

if __name__ == "__main__":
    main()