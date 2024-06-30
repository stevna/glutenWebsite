from DB import Collection
from flask_login import current_user

def filter_products(filter):
    price_from_range = filter.pop("price_from_range")
    price_to_range = filter.pop("price_to_range")
    final_filter:dict = {}
    for key, val in filter.items():
        if not val or val == "false":
            continue
        final_filter[key] = val

    print("final_filter: ", final_filter)

    aggr = [

    ]

    price_filter = {}
    if price_from_range and price_to_range:
        price_filter = {"price": {"$gte": price_from_range, "$lt": price_to_range}}

    filters = [final_filter, price_filter]

    filtered_data = Collection("Products").find({"$and": filters})

    return filtered_data




