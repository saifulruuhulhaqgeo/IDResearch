from dataclasses import dataclass

@dataclass
class Jurnal:
    collection_type = "jurnal"
    title: str
    description: str
    abstract: str
    writer: str
    year: int
    daerah_level: int  # 1. Provinsi 2. Kabupaten 3. Kecamatan 4. Desa
    daerah: str
    topik: str
    ref_link: str

@dataclass
class SccraperStats:
    label: str 
    agent_ip: str

@dataclass
class InformationLake:
    title: str
    description: str
    abstract: str
    author: str
    year: int
    daerah_label: str
    daerah_level: int
    daerah_code: int
    links: list
    topik_id: str
    source: str
    stats: SccraperStats

