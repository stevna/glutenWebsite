from dataclasses import dataclass, field
from datetime import datetime
from time import time
import os

@dataclass
class ProductEntry:
    _id: str = ""
    name: str = ""
    category: str = ""
    buy_place: str = ""
    vendor: str = ""
    price: float = 0
    keywords: list = field(default_factory=lambda: [])
    image: str = ""
    vegetarian: bool = False
    vegan: bool = False
    lactosefree: bool = False
    can_contain_traces : bool = False


    @classmethod
    def convert_to_product(cls, data):
        return cls(**data)








