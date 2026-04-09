#!/usr/bin/env python3

import urllib.request
import urllib.error
from urllib.parse import urlparse
import argparse
import sys
import os
from collections import OrderedDict


def download_html(url):
    """
    Download HTML content from a URL and return it as a string.
    
    Args:
        url (str): The URL to download HTML from
        
    Returns:
        str: The HTML content as a string
        
    Raises:
        urllib.error.URLError: If there's an error downloading the content
    """
    try:
        # Create request with headers to mimic a browser request
        req = urllib.request.Request(
            url,
            headers={
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5',
                'Accept-Encoding': 'gzip, deflate',
                'DNT': '1',
                'Connection': 'keep-alive',
                'Upgrade-Insecure-Requests': '1'
            }
        )
        
        # Download the HTML content
        with urllib.request.urlopen(req, timeout=30) as response:
            # Handle gzip encoding
            import gzip
            content = response.read()
            
            # Check if content is gzipped
            if content[:2] == b'\x1f\x8b':
                content = gzip.decompress(content)
            
            html_content = content.decode('utf-8')
            
        return html_content
        
    except urllib.error.URLError as e:
        print(f"Error downloading HTML from {url}: {e}")
        raise


def generate_filename(url):
    """
    Generate a filename based on URL using first 10 and last 10 unique characters.
    
    Args:
        url (str): The URL to generate filename from
        
    Returns:
        str: Generated filename with .html extension
    """
    # Remove protocol and www prefix for cleaner filename
    clean_url = url.replace('https://', '').replace('http://', '').replace('www.', '')
    
    # Get unique characters while preserving order
    unique_chars = list(OrderedDict.fromkeys(char for char in clean_url if char.isalnum()))
    
    # Take first 10 and last 10 unique characters
    if len(unique_chars) <= 20:
        filename_base = ''.join(unique_chars)
    else:
        filename_base = ''.join(unique_chars[:10] + unique_chars[-10:])
    
    return f"{filename_base}.html"


def save_html_to_file(html_content, filename):
    """
    Save HTML content to a file.
    
    Args:
        html_content (str): The HTML content to save
        filename (str): The filename to save to
    """
    try:
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(html_content)
        print(f"HTML content saved to: {filename}")
    except IOError as e:
        print(f"Error saving file {filename}: {e}")
        raise


def main():
    """Main function to download HTML from any URL and save to file."""
    parser = argparse.ArgumentParser(description='Download HTML from a URL and save to file')
    parser.add_argument('url', help='The URL to download HTML from')
    parser.add_argument('-o', '--output', help='Output filename (optional)')
    
    args = parser.parse_args()
    
    try:
        print(f"Downloading HTML from: {args.url}")
        html_content = download_html(args.url)
        
        # Generate filename if not provided
        if args.output:
            filename = args.output
        else:
            filename = generate_filename(args.url)
        
        # Save to file
        save_html_to_file(html_content, filename)
        
        print(f"Successfully downloaded {len(html_content)} characters of HTML content")
        
        return html_content
        
    except Exception as e:
        print(f"Failed to download HTML: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()