import os
from datetime import datetime
import time

from schoolar import SchoolarScraper
from stem.control import Controller
from tbselenium.tbdriver import TorBrowserDriver
import tbselenium.common as cm
from tbselenium.utils import launch_tbb_tor_with_stem
from selenium.webdriver.common.utils import free_port
import tempfile
from os.path import join
import time
from tbselenium.utils import start_xvfb, stop_xvfb
from repository import JurnalRepository


def start():
    print("starting scraper at {} with name {}".format(datetime.now(),  os.getenv("HOSTNAME") ))

    tbb_dir = 'tor-browser_en-US'

    xvfb_display = start_xvfb()

    socks_port = free_port()
    control_port = free_port()
    tor_data_dir = tempfile.mkdtemp()
    torrc = {'ControlPort': str(control_port), 'SOCKSPort': str(socks_port), 'DataDirectory': tor_data_dir}
    tor_binary = join(tbb_dir, cm.DEFAULT_TOR_BINARY_PATH)
    tor_process = launch_tbb_tor_with_stem(tbb_path=tbb_dir, torrc=torrc, tor_binary=tor_binary)

    Controller.from_port(port=control_port).authenticate()
    driver = TorBrowserDriver(tbb_dir, socks_port=socks_port, control_port=control_port, tor_cfg=cm.USE_STEM,tbb_logfile_path='/dev/null' )
    driver.load_url("https://scholar.google.com")
    print("CONNECTED")
    print(driver.page_source)

    octoRepository = JurnalRepository(octoHost=os.getenv("OCTO_HOST"), label=os.getenv("HOSTNAME"))

    scraper_agent =  SchoolarScraper(webDriver=driver, octoRepository=octoRepository)
    scraper_agent.scraper_topic_keyword = "ruang terbuka"
    scraper_agent.scraper_daerah_keyword = "kota bandung"
    scraper_agent.scraper_daerah_level = 3
    scraper_agent.dry = False
    scraper_agent.start_agent()

    time.sleep(5000)
    stop_xvfb(xvfb_display)
    tor_process.kill()

start()
