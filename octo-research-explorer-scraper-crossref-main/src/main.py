
import os
from datetime import datetime
from selenium import webdriver

from selenium import webdriver


from crossref import CrossrefScraper
from repository import JurnalRepository

def start():
    print("starting scraper at {} with name {}".format(datetime.now(),  os.getenv("HOSTNAME") ))

    driver = webdriver.Firefox()

    octoRepository = JurnalRepository(octoHost=os.getenv("OCTO_HOST"), label=os.getenv("HOSTNAME"))

    scraper_agent =  CrossrefScraper(webDriver=driver, octoRepository=octoRepository)
    scraper_agent.scraper_topic_keyword = "ruang terbuka"
    scraper_agent.scraper_daerah_keyword = "kota bandung"
    scraper_agent.scraper_daerah_level = 3
    scraper_agent.dry = False
    scraper_agent.start_agent()


start()
