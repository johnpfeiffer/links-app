#!/usr/bin/env python3

import json
import re
import subprocess
import sys

def extract_se_radio_urls():
    """Extract all SE Radio URLs from JSON files."""
    urls = []
    
    # Read all JSON files
    json_files = ['people.json', 'engineering.json', 'business.json', 'ai.json', 'history.json']
    
    for json_file in json_files:
        try:
            with open(json_file, 'r', encoding='utf-8') as f:
                data = json.load(f)
                
            # Extract URLs from the data structure
            for category_name, items in data.items():
                for item in items:
                    url = item.get('url', '')
                    if 'se-radio.net' in url:
                        urls.append(url)
                        
        except FileNotFoundError:
            print(f"Warning: {json_file} not found")
        except json.JSONDecodeError:
            print(f"Warning: {json_file} has invalid JSON")
    
    return list(set(urls))  # Remove duplicates

def download_all_se_radio_pages(urls):
    """Download all SE Radio pages using the download script."""
    print(f"Found {len(urls)} unique SE Radio URLs")
    
    for i, url in enumerate(urls, 1):
        print(f"Downloading {i}/{len(urls)}: {url}")
        try:
            # Call the download script
            result = subprocess.run(['python3', 'download-url.py', url], 
                                  capture_output=True, text=True)
            if result.returncode == 0:
                print(f"  ✓ Downloaded successfully")
            else:
                print(f"  ✗ Failed: {result.stderr}")
        except Exception as e:
            print(f"  ✗ Error: {e}")

if __name__ == "__main__":
    urls = extract_se_radio_urls()
    print("SE Radio URLs found:")
    for url in sorted(urls):
        print(f"  {url}")
    
    print(f"\nTotal: {len(urls)} URLs")
    
    # Ask for confirmation
    response = input("\nDownload all SE Radio pages? (y/N): ")
    if response.lower() == 'y':
        download_all_se_radio_pages(urls)
    else:
        print("Skipped download")
        print("\nTo download manually, run:")
        for url in urls:
            print(f"python3 download-url.py \"{url}\"")