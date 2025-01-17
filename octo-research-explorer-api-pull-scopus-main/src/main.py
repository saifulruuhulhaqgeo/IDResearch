import os
from datetime import datetime
import time

from scopus import ScopusPull
import time
from repository import JurnalRepository


def start():
    print("starting scraper at {} with name {}".format(datetime.now(),  os.getenv("SCRAPER_LABEL") ))


    octoRepository = JurnalRepository(octoHost=os.getenv("OCTO_HOST"), label=os.getenv("SCRAPER_LABEL"))

    scraper_agent =  ScopusPull(octoRepository=octoRepository)
    scraper_agent.scraper_topic_keyword = "ruang terbuka"
    scraper_agent.scraper_daerah_keyword = "kota bandung"
    scraper_agent.scraper_daerah_level = 3
    scraper_agent.dry = False
    scraper_agent.start_agent()


start()
