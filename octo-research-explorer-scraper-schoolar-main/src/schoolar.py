import dataclasses
import re
import sys

from selenium.webdriver.firefox.webdriver import WebDriver
import time
from stem.exit_policy import socket

from jurnal_entity import InformationLake, Jurnal, SccraperStats
from faker import Faker
from selenium.webdriver.common.by import By
from random import randrange
from repository import JurnalRepository


class SchoolarScraper:
    def __init__(self, webDriver: WebDriver, octoRepository: JurnalRepository) -> None:
        self.scraper_run = True
        self.dry = False
        self.scraper_topic_keyword: str
        self.scraper_daerah_keyword: str
        self.webDriver = webDriver
        self.scraper_daerah_level = 4
        self.level = {
            1:"provinsi",
            2:"kabupaten",
            3:"kecamatan",
            4:"desa"
        }
        self.repository = octoRepository



    def getIP(self):
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
        s.close()
        return ip

    def scrap(self):
        self.webDriver.set_page_load_timeout(60)
        self.webDriver.switch_to.new_window('tab')
        tab1 = self.webDriver.window_handles[0]
        _ = self.webDriver.window_handles[1]
        self.webDriver.switch_to.window(tab1)
        print("starting")
        while self.scraper_run:
            params = self.repository.get_params()
            print("PARAM", params)
            time.sleep(2)
            if params is not None:
                target_page = 40
                page = 0
                while page < target_page:
                    self.scraper_daerah_keyword = self.level[params['daerah_level']] + " " + params['daerah_label']
                    self.scraper_topic_keyword = params['topic']

                    print("GET PAGE KE " + str(page))

                    keyword = self.scraper_topic_keyword.replace(" ", "+") + "+" + self.scraper_daerah_keyword.replace(" ", "+")
                    uri = 'https://scholar.google.com/scholar?start={0}&q=%22{1}%22&as_ylo=2010'.format(page, keyword)
                    print("URL => ", uri)
                    self.webDriver.get(uri)
                    time.sleep(5)
                    print("LENGTH SOURCE", len(self.webDriver.page_source))

                    body = self.webDriver.find_element(By.XPATH, '/html/body')
 
                    lists = body.find_elements(By.CLASS_NAME, 'gs_ri')
                    print("FAILED", len(lists))
                    if len(lists) == 0:
                        print(self.webDriver.page_source)
                        self.webDriver.close()
                        sys.exit("blank or blocked")
                    if len(lists) > 0:
                        for x in range(len(lists)):
                            # print("=======================================")
                            try:
                                titleEl = lists[x].find_element(By.CLASS_NAME, 'gs_rt')
                                pDesc = lists[x].find_element(By.CLASS_NAME, 'gs_rs')
                                pAuthor = lists[x].find_element(By.CLASS_NAME, 'gs_a')
                                pYear = re.findall(r'.*([1-3][0-9]{3})', pAuthor.text)
                                print("TITLE => ", titleEl.text)
                                print("DESCRIPTION => ", pDesc.text)
                                print("AUTHOR => ", pAuthor.text.split("-")[0])
                                print("YEAR => ", pYear)
                                linkEl = titleEl.find_element(By.TAG_NAME, "a").get_attribute("href")
                                print("LINK => ", linkEl)
                                #abstrak =  self.getAbstract(linkEl,tab2)
                                self.webDriver.switch_to.window(tab1)
                                #saveToTxt(lists[x].text, page, x)
                                print("=")

                                if len(pYear) != 0:
                                    information = InformationLake(
                                        title=titleEl.text,
                                        description =pDesc.text,
                                        abstract = "-",
                                        author = pAuthor.text.split("-")[0],
                                        year = int(pYear[0]),
                                        daerah_label = params['daerah_label'],
                                        daerah_level = params['daerah_level'],
                                        daerah_code = params['daerah_code'],
                                        links = [linkEl],
                                        topik_id = params['topic_id'],
                                        source = "Google Scholar",
                                        stats = SccraperStats(
                                            label=self.repository.label,
                                            agent_ip=self.getIP(),
                                        )
                                    )
                                    self.repository.ingest_information(information)
                            except:
                                print("parsing error")
                    page += 20
                    time.sleep(5 + randrange(10))
                time.sleep(5 + randrange(10))

    def dry_run(self):
        while self.scraper_run:
            time.sleep(2)
            fake = Faker()
            jurnal = Jurnal(
                title=fake.address(),
                description=fake.text(),
                abstract=fake.text(),
                writer=fake.name(),
                year=2022,
                daerah_level=1,
                daerah="Jawa Tengah",
                topik="Pangan",
                ref_link="https://fakelink.net"
            )
            print(dataclasses.asdict(jurnal))

    def start_agent(self) -> None:
        if self.dry:
            self.dry_run()
        else:
            self.scrap()

