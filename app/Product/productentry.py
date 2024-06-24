from dataclasses import dataclass, field
from datetime import datetime
from time import time

@dataclass
class ProductEntry:
    name: str = ""
    image: str = ""
    category: str = ""
    buy_place: datetime = time()
    vendor: str = ""
    price: float = 0
    keywords: list = field(default_factory=lambda: [])





