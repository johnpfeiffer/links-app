#!/usr/bin/env python3

import os
import re
import json
from datetime import datetime

def extract_date_from_html(html_file):
    """Extract the publication date from an SE Radio HTML file."""
    try:
        with open(html_file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Look for the updated date pattern
        pattern = r'<span class="updated">([^<]+)</span>'
        match = re.search(pattern, content)
        
        if match:
            date_str = match.group(1).strip()
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
            
            print(f"Warning: Could not parse date '{date_str}' from {html_file}")
            return date_str  # Return original if can't parse
        
        print(f"Warning: No date found in {html_file}")
        return None
        
    except Exception as e:
        print(f"Error reading {html_file}: {e}")
        return None

def get_url_to_filename_mapping():
    """Create a mapping from URL to downloaded HTML filename."""
    url_to_file = {}
    
    # List all .html files in current directory
    html_files = [f for f in os.listdir('.') if f.endswith('.html')]
    
    for html_file in html_files:
        # Extract URL from the HTML file to map it back
        try:
            with open(html_file, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Look for canonical URL or other URL indicators
            # For now, we'll use a simpler approach based on episode numbers
            episode_pattern = r'episode-(\d+)|episode (\d+)'
            match = re.search(episode_pattern, content, re.IGNORECASE)
            
            if match:
                episode_num = match.group(1) or match.group(2)
                url_to_file[episode_num] = html_file
            
        except Exception as e:
            print(f"Error processing {html_file}: {e}")
    
    return url_to_file

def extract_all_dates():
    """Extract dates from all SE Radio HTML files."""
    dates = {}
    
    # Get all HTML files
    html_files = [f for f in os.listdir('.') if f.endswith('.html')]
    print(f"Found {len(html_files)} HTML files")
    
    for html_file in html_files:
        print(f"Processing {html_file}...")
        date = extract_date_from_html(html_file)
        if date:
            dates[html_file] = date
            print(f"  Date: {date}")
        else:
            print(f"  No date found")
    
    return dates

def update_json_with_dates():
    """Update JSON files with extracted dates."""
    # First extract all dates
    print("Extracting dates from HTML files...")
    dates = extract_all_dates()
    
    # Load SE Radio URLs and their mappings
    se_radio_urls = [
        "https://se-radio.net/2009/05/episode-134-release-it-with-michael-nygard/",
        "https://se-radio.net/2010/03/episode-157-hadoop-with-philip-zeyliger",
        "https://se-radio.net/2010/09/episode-167-the-history-of-junit-and-the-future-of-testing-with-kent-beck",
        "https://se-radio.net/2010/11/episode-169-memory-grid-architecture-with-nati-shalom",
        "https://se-radio.net/2014/11/episode-215-gang-of-four-20-years-later",
        "https://se-radio.net/2015/02/episode-221-jez-humble-on-continuous-delivery",
        "https://se-radio.net/2015/04/episode-224-sven-johann-and-eberhard-wolff-on-technical-debt",
        "https://se-radio.net/2015/05/se-radio-episode-226-eric-evans-on-domain-driven-design-at-10-years",
        "https://se-radio.net/2015/05/the-cap-theorem-then-and-now",
        "https://se-radio.net/2015/07/episode-232-mark-nottingham-on-http2/",
        "https://se-radio.net/2015/11/se-radio-episode-241-kyle-kingsbury-on-consensus-in-distributed-systems",
        "https://se-radio.net/2016/01/se-radio-show-246-john-wilkes-on-borg-and-kubernetes",
        "https://se-radio.net/2017/01/se-radio-episode-280-gerald-weinberg-on-bugs-errors-and-software-quality",
        "https://se-radio.net/2017/02/se-radio-episode-282-donny-nadolny-on-debugging-distributed-systems",
        "https://se-radio.net/2017/03/se-radio-episode-285-james-cowling-on-dropboxs-distributed-storage-system",
        "https://se-radio.net/2017/04/se-radio-episode-287-success-skills-for-architects-with-neil-ford",
        "https://se-radio.net/2017/06/se-radio-episode-295-michael-feathers-on-legacy-code",
        "https://se-radio.net/2017/10/se-radio-episode-306-ron-lichty-on-managing-programmers",
        "https://se-radio.net/2018/03/se-radio-episode-320-nate-taggart-on-serverless-paradigm",
        "https://se-radio.net/2018/10/se-radio-episode-340-lara-hogan-and-deepa-subramaniam-on-revitalizing-a-cross-functional-product-organization",
        "https://se-radio.net/2019/02/se-radio-episode-355-randy-shoup-scaling-technology-and-organization/",
        "https://se-radio.net/2019/02/se-radio-episode-358-probabilistic-data-structure-for-big-data-problems/",
        "https://se-radio.net/2019/03/se-radio-episode-359-engineering-maturity-with-jean-denis-greze/",
        "https://se-radio.net/2019/07/episode-373-joel-spolsky-on-startups-growth-and-valuation/",
        "https://se-radio.net/2019/07/episode-374-marcus-blankenship-on-motivating-programmers/",
        "https://se-radio.net/2020/03/episode-403-karl-hughes-on-speaking-at-tech-conferences/",
        "https://se-radio.net/2020/04/episode-405-yevgeniy-brikman-on-infrastructure-as-code-best-practices/",
        "https://se-radio.net/2020/05/episode-409-joe-kutner-on-the-twelve-factor-app/",
        "https://se-radio.net/2021/02/episode-447-michael-perry-on-immutable-architecture/",
        "https://se-radio.net/2021/07/episode-470-l-peter-deutsch-on-the-fallacies-of-distributed-computing/",
        "https://se-radio.net/2022/06/episode-515-swizec-teller-on-becoming-a-senior-engineer/",
        "https://se-radio.net/2022/08/episode-525-randy-shoup-on-evolving-architecture-and-organization-at-ebay/",
        "https://se-radio.net/2022/12/episode-543-jon-smart-on-patterns-and-anti-patterns-for-successful-software-delivery-in-enterprises/",
        "https://se-radio.net/2024/02/se-radio-601-han-yuan-on-reorganizations/",
        "https://se-radio.net/2024/02/se-radio-604-karl-wiegers-and-candase-hokanson-on-software-requirements-essentials/",
        "https://se-radio.net/2024/05/se-radio-616-ori-saporta-on-the-role-of-the-software-architect/",
        "https://se-radio.net/2025/09/se-radio-684-dan-bergh-johnsson-and-daniel-deogun-on-secure-by-design/"
    ]
    
    print(f"\nMapping URLs to dates...")
    url_to_date = {}
    
    # Map each URL to its date by finding the corresponding HTML file
    for url in se_radio_urls:
        # Generate expected filename
        import urllib.request
        import urllib.error
        from urllib.parse import urlparse
        import os
        from collections import OrderedDict
        
        # Recreate the filename generation logic
        clean_url = url.replace('https://', '').replace('http://', '').replace('www.', '')
        unique_chars = list(OrderedDict.fromkeys(char for char in clean_url if char.isalnum()))
        
        if len(unique_chars) <= 20:
            filename_base = ''.join(unique_chars)
        else:
            filename_base = ''.join(unique_chars[:10] + unique_chars[-10:])
        
        expected_filename = f"{filename_base}.html"
        
        if expected_filename in dates:
            url_to_date[url] = dates[expected_filename]
            print(f"  {url} -> {dates[expected_filename]}")
        else:
            print(f"  Warning: No date found for {url} (expected file: {expected_filename})")
    
    return url_to_date

if __name__ == "__main__":
    url_to_date = update_json_with_dates()
    
    print(f"\nExtracted {len(url_to_date)} dates:")
    for url, date in sorted(url_to_date.items()):
        print(f"  {url} -> {date}")