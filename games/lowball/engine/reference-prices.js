/* Dated reference corrections. Old Dailies and snapshotless drafts retain original targets. */
(root=>{
 'use strict';
 const effectiveDay='2026-10-24',checkedAt='2026-10-22',regions=['AU','US','UK','CA'];
 const reviewed={
  "Standard stamp": {
    "AU": {
      "price": 1.85,
      "detail": "Australia Post ordinary small letter up to 250g, regular service",
      "source": "https://auspost.com.au/disruptions-and-updates/pricing-updates/bpr-letter-pricing-update"
    },
    "US": {
      "price": 0.82,
      "detail": "USPS Forever postage for a domestic 1 oz letter",
      "source": "https://store.usps.com/store/product/buy-stamps/us-flag-2026-stamps-S_130104"
    },
    "UK": {
      "price": 1.8,
      "detail": "Royal Mail First Class standard letter up to 100g",
      "source": "https://www.royalmail.com/sending/uk/1st-class"
    },
    "CA": {
      "price": 1.44,
      "detail": "Canada Post single domestic stamp up to 30g, not a booklet",
      "source": "https://www.canadapost-postescanada.ca/cpc/en/support/articles/lettermail/pricing.page"
    }
  },
  "iPhone 16": {
    "AU": {
      "price": 1349,
      "detail": "Apple iPhone 16, 128GB unlocked, advertised outright price",
      "source": "https://www.apple.com/au/shop/buy-iphone/iphone-16"
    },
    "US": {
      "price": 829,
      "detail": "Apple iPhone 16, 128GB unlocked, outright; no trade-in, connect to any carrier later",
      "source": "https://www.apple.com/shop/buy-iphone/iphone-16"
    },
    "UK": {
      "price": 799,
      "detail": "Apple iPhone 16, 128GB unlocked, outright; no trade-in",
      "source": "https://www.apple.com/uk/shop/buy-iphone/iphone-16"
    },
    "CA": {
      "price": 1149,
      "detail": "Apple iPhone 16, 128GB unlocked, outright; no trade-in",
      "source": "https://www.apple.com/ca/shop/buy-iphone/iphone-16"
    }
  },
  "AirPods Pro 3": {
    "AU": {
      "price": 429,
      "detail": "Apple AirPods Pro 3, regular advertised price",
      "source": "https://www.apple.com/au/shop/buy-airpods/airpods-pro-3"
    },
    "US": {
      "price": 249,
      "detail": "Apple AirPods Pro 3, regular advertised price",
      "source": "https://www.apple.com/shop/buy-airpods/airpods-pro-3"
    },
    "UK": {
      "price": 219,
      "detail": "Apple AirPods Pro 3, regular advertised price",
      "source": "https://www.apple.com/uk/shop/buy-airpods/airpods-pro-3"
    },
    "CA": {
      "price": 329,
      "detail": "Apple AirPods Pro 3, regular advertised price",
      "source": "https://www.apple.com/ca/shop/buy-airpods/airpods-pro-3"
    }
  },
  "Spotify Premium": {
    "AU": {
      "price": 15.99,
      "detail": "Spotify Premium Individual, regular monthly price after promotions",
      "source": "https://www.spotify.com/au/premium/"
    },
    "US": {
      "price": 12.99,
      "detail": "Spotify Premium Individual, regular monthly price after promotions",
      "source": "https://www.spotify.com/us/premium/"
    },
    "UK": {
      "price": 12.99,
      "detail": "Spotify Premium Individual, regular monthly price after promotions",
      "source": "https://www.spotify.com/uk/premium/"
    },
    "CA": {
      "price": 13.99,
      "detail": "Spotify Premium Individual, regular monthly price after promotions",
      "source": "https://www.spotify.com/ca-en/premium/"
    }
  },
  "iPad": {
    "AU": {
      "price": 749,
      "detail": "Apple iPad (A16), 11-inch, 128GB Wi-Fi, new; no trade-in",
      "source": "https://www.apple.com/au/shop/buy-ipad/ipad"
    },
    "US": {
      "price": 449,
      "detail": "Apple iPad (A16), 11-inch, 128GB Wi-Fi, new; no trade-in",
      "source": "https://www.apple.com/shop/buy-ipad/ipad"
    },
    "UK": {
      "price": 429,
      "detail": "Apple iPad (A16), 11-inch, 128GB Wi-Fi, new; no trade-in",
      "source": "https://www.apple.com/uk/shop/buy-ipad/ipad"
    },
    "CA": {
      "price": 649,
      "detail": "Apple iPad (A16), 11-inch, 128GB Wi-Fi, new; no trade-in",
      "source": "https://www.apple.com/ca/shop/buy-ipad/ipad"
    }
  },
  "Apple Watch SE": {
    "AU": {
      "price": 399,
      "detail": "Apple Watch SE 3, 40mm aluminium, GPS, Sport Band, new; no trade-in",
      "source": "https://www.apple.com/au/shop/buy-watch/apple-watch-se"
    },
    "US": {
      "price": 249,
      "detail": "Apple Watch SE 3, 40mm aluminium, GPS, Sport Band, new; no trade-in",
      "source": "https://www.apple.com/shop/buy-watch/apple-watch-se"
    },
    "UK": {
      "price": 219,
      "detail": "Apple Watch SE 3, 40mm aluminium, GPS, Sport Band, new; no trade-in",
      "source": "https://www.apple.com/uk/shop/buy-watch/apple-watch-se"
    },
    "CA": {
      "price": 329,
      "detail": "Apple Watch SE 3, 40mm aluminium, GPS, Sport Band, new; no trade-in",
      "source": "https://www.apple.com/ca/shop/buy-watch/apple-watch-se"
    }
  },
  "Netflix Standard": {
    "AU": {
      "price": 20.99,
      "detail": "Netflix Standard without ads, regular monthly plan",
      "source": "https://www.netflix.com/au/title/81718240"
    },
    "UK": {
      "price": 13.99,
      "detail": "Netflix Standard without adverts, regular monthly plan",
      "source": "https://www.netflix.com/gb/title/80100172"
    },
    "CA": {
      "price": 18.99,
      "detail": "Netflix Standard without ads, regular monthly plan",
      "source": "https://www.netflix.com/ca/title/80209553"
    },
    "US": {
      "price": 19.99,
      "detail": "Netflix Standard without ads, regular monthly plan",
      "source": "https://help.netflix.com/en/node/24926"
    }
  },
  "Litre of milk": {
    "AU": {
      "price": 1.75,
      "detail": "Coles Dairy Full Cream Milk, 1L; advertised online price",
      "source": "https://www.coles.com.au/product/coles-dairy-full-cream-milk-1l-9052681"
    },
    "UK": {
      "price": 1.85,
      "detail": "Tesco Finest Jersey Whole Milk, 1L; regular online price",
      "source": "https://www.tesco.com/shop/en-GB/browse/groceries-and-essentials/fresh-food/milk-butter-and-eggs/milk/all?facetsArgs=category%3AWhole+Milk"
    },
    "CA": {
      "price": 4.79,
      "detail": "Metro Lactantia PurFiltre 3.25% Milk, 1L; regular online price before offer",
      "source": "https://www.metro.ca/en/online-grocery/aisles/dairy-eggs/milk-cream-butter/2-whole-milk/3-25-homogenized-milk/p/068200010014"
    }
  },
  "Loaf of bread": {
    "AU": {
      "price": 3.5,
      "detail": "Coles High Fibre White Sandwich Bread, 700g; advertised online price",
      "source": "https://www.coles.com.au/product/coles-high-fibre-white-sandwich-bread-700g-4938243"
    },
    "CA": {
      "price": 2.68,
      "detail": "Walmart Great Value White Bread, 675g, 9 essential nutrients; online listing",
      "source": "https://www.walmart.ca/en/ip/great-value-white-bread/6000206630300"
    },
    "US": {
      "price": 1.52,
      "detail": "Walmart Great Value White Sandwich Bread, 20 oz; online price",
      "source": "https://www.walmart.com/c/best-sellers/white-sandwich-bread"
    },
    "UK": {
      "price": 0.59,
      "detail": "Tesco White Medium Bread, 800g; advertised online price",
      "source": "https://www.tesco.com/shop/en-GB/products/288406949"
    }
  },
  "Coca-Cola bottle": {
    "AU": {
      "price": 4.7,
      "detail": "Coles Coca-Cola Classic, 600mL; regular price before specials",
      "source": "https://www.coles.com.au/product/coca-cola-classic-soft-drink-bottle-600ml-5468407"
    },
    "US": {
      "price": 2.48,
      "detail": "Walmart Coca-Cola Original Taste, one 20 US fl oz bottle; online price",
      "source": "https://www.walmart.com/ip/22790215"
    },
    "CA": {
      "price": 2.87,
      "detail": "Walmart Coca-Cola Original Taste, one 500mL bottle; Mississauga online price",
      "source": "https://www.walmart.ca/en/ip/coca-cola-500ml-bottle/6000196224008"
    },
    "UK": {
      "price": 1.89,
      "detail": "Tesco Coca-Cola Original Taste, one 500mL bottle; regular single-item price",
      "source": "https://www.tesco.com/shop/en-GB/products/258458190"
    }
  },
  "Dozen eggs": {
    "AU": {
      "price": 6.9,
      "detail": "Coles Free Range Eggs, 12 pack, 700g; online listing",
      "source": "https://www.coles.com.au/product/coles-free-range-eggs-12-pack-700g-9453478"
    },
    "US": {
      "price": 2.96,
      "detail": "Walmart Marketside Large Cage-Free Brown Eggs, 12 count; regular price before rollback",
      "source": "https://www.walmart.com/ip/49463949"
    },
    "CA": {
      "price": 7.82,
      "detail": "Walmart Great Value Organic Free Run Large Brown Eggs, 12; regular price before rollback",
      "source": "https://www.walmart.ca/en/ip/Great-Value-Organic-Free-Run-Large-Brown-12-Eggs/6000196119460"
    },
    "UK": {
      "price": 3.35,
      "detail": "Tesco Large Free Range Eggs, 12 pack; regular online price",
      "source": "https://www.tesco.com/shop/en-GB/search?query=12+large+free+range+eggs"
    }
  },
  "Avocado": {
    "AU": {
      "price": 2.7,
      "detail": "Coles Hass Avocado, one; advertised online price",
      "source": "https://www.coles.com.au/product/coles-hass-avocados-1-each-5900530"
    },
    "UK": {
      "price": 0.69,
      "detail": "Tesco Ripe & Ready Avocado, one; regular online price",
      "source": "https://www.tesco.com/shop/en-GB/browse/groceries-and-essentials/fresh-food/fresh-salad-coleslaw-and-sandwich-fillers/avocado"
    },
    "CA": {
      "price": 1.99,
      "detail": "Food Basics Hass Avocado, sold individually; advertised online price",
      "source": "https://www.foodbasics.ca/aisles/fruits-vegetables/fruits/avocadoes-exotic-fruits/hass-avocado/p/4770"
    }
  },
  "Bananas": {
    "AU": {
      "price": 4.9,
      "detail": "Coles loose bananas, price for 1kg; advertised online price",
      "source": "https://www.coles.com.au/product/coles-bananas-approx.-170g-409499"
    },
    "UK": {
      "price": 0.9,
      "detail": "Tesco loose bananas, price for 1kg; advertised online price",
      "source": "https://www.tesco.com/shop/en-GB/products/253555203"
    }
  },
  "Cheddar cheese block": {
    "AU": {
      "price": 6.8,
      "detail": "Coles Tasty Cheese Block, 500g; advertised online price",
      "source": "https://www.coles.com.au/product/coles-cheese-block-tasty-500g-293995"
    },
    "US": {
      "price": 3.58,
      "detail": "Walmart Great Value Extra Sharp Cheddar Cheese, 16 oz block; online price",
      "source": "https://www.walmart.com/ip/10452494"
    },
    "UK": {
      "price": 3.2,
      "detail": "Tesco British Mild Cheddar Cheese, 400g; regular online price",
      "source": "https://www.tesco.com/shop/en-GB/browse/groceries-and-essentials/fresh-food/cheese/cheddar-cheese"
    },
    "CA": {
      "price": 5.48,
      "detail": "Walmart Great Value Old Cheddar Cheese, 400g; Mississauga online price",
      "source": "https://www.walmart.ca/en/ip/great-value-old-cheddar-cheese/6000208884796"
    }
  },
  "Butter": {
    "AU": {
      "price": 4.8,
      "detail": "Coles Salted Butter, 250g; advertised online price",
      "source": "https://www.coles.com.au/product/coles-salted-butter-250g-313505"
    },
    "US": {
      "price": 3.06,
      "detail": "Walmart Great Value Sweet Cream Salted Butter, 16 oz, four sticks; regular price before rollback",
      "source": "https://www.walmart.com/c/kp/great-value-butter-sticks"
    },
    "UK": {
      "price": 1.85,
      "detail": "Tesco British Salted Block Butter, 250g; regular online price",
      "source": "https://www.tesco.com/shop/en-GB/products/290920510"
    },
    "CA": {
      "price": 5.96,
      "detail": "Walmart Great Value Salted Butter, 454g; Mississauga online price",
      "source": "https://www.walmart.ca/en/ip/Great-Value-Salted-Butter/6000200237828"
    }
  },
  "Rice": {
    "AU": {
      "price": 1.8,
      "detail": "Coles Simply White Long Grain Rice, 1kg; advertised online price",
      "source": "https://www.coles.com.au/product/coles-simply-white-long-grain-rice-1kg-5357574"
    },
    "UK": {
      "price": 1.25,
      "detail": "Tesco Easy Cook Long Grain Rice, 1kg; regular online price",
      "source": "https://www.tesco.com/shop/en-GB/search?query=long+grain+rice"
    },
    "CA": {
      "price": 3.47,
      "detail": "Walmart Great Value Long Grain White Rice, 900g; online price",
      "source": "https://www.walmart.ca/en/ip/Great-Value-Long-Grain-White-Rice/4UD9P76BEQB4"
    },
    "US": {
      "price": 1.77,
      "detail": "Walmart Great Value Long Grain Enriched Rice, 32 oz; online price",
      "source": "https://www.walmart.com/ip/10315394?selected=true"
    }
  },
  "Pasta": {
    "AU": {
      "price": 1,
      "detail": "Coles Durum Wheat Spaghetti, 500g; advertised online price",
      "source": "https://www.coles.com.au/product/coles-durum-wheat-pasta-spaghetti-500g-3328972"
    },
    "UK": {
      "price": 0.75,
      "detail": "Tesco Quick Cook Spaghetti, 500g; regular online price",
      "source": "https://www.tesco.com/shop/en-GB/search?query=spaghetti+pasta"
    },
    "CA": {
      "price": 1.97,
      "detail": "Walmart Great Value Spaghetti, 900g; online price",
      "source": "https://www.walmart.ca/en/ip/Great-Value-Spaghetti-Pasta/2QV9LGU46RLX"
    },
    "US": {
      "price": 1.24,
      "detail": "Walmart Great Value Spaghetti, 16 oz; regular price before rollback",
      "source": "https://www.walmart.com/ip/10534115?sid=248322fa-0bf1-406c-b97d-8b2767a5494d"
    }
  },
  "Peanut butter": {
    "AU": {
      "price": 5.8,
      "detail": "Coles Bega Smooth Peanut Butter, 375g; regular online price",
      "source": "https://www.coles.com.au/product/bega-spread-peanut-butter-smooth-375g-130607"
    },
    "UK": {
      "price": 1.8,
      "detail": "Tesco Smooth Peanut Butter, 100% nuts, 340g; regular online price",
      "source": "https://www.tesco.com/shop/en-GB/products/323496016"
    },
    "CA": {
      "price": 2.98,
      "detail": "Walmart Great Value Smooth Peanut Butter, 500g; Mississauga online price",
      "source": "https://www.walmart.ca/en/ip/great-value-smooth-peanut-butter/6000197838604"
    },
    "US": {
      "price": 2.18,
      "detail": "Walmart Great Value Creamy Peanut Butter, 18 oz; online price",
      "source": "https://www.walmart.com/ip/10315475?listRegistryId=aea2d574-cd18-4bdb-91b2-8d6395569530&listRegistryType=RR"
    }
  },
  "Disney+": {
    "AU": {
      "price": 17.99,
      "detail": "Disney+ Standard, regular monthly subscription, no ads in on-demand movies/series",
      "source": "https://www.disney.com.au/disney-plus"
    },
    "UK": {
      "price": 11.99,
      "detail": "Disney+ Standard, regular monthly subscription after offers, no minimum term",
      "source": "https://www.disneyplus.com/en-gb"
    },
    "CA": {
      "price": 15.99,
      "detail": "Disney+ Standard, regular monthly standalone subscription",
      "source": "https://www.disneyplus.com/en-ca"
    }
  },
  "Breakfast cereal": {
    "US": {
      "price": 4.98,
      "detail": "Walmart Kellogg's Corn Flakes, 18 oz family-size box; online price",
      "source": "https://www.walmart.com/ip/10818608"
    }
  },
  "Chocolate block": {
    "UK": {
      "price": 2.75,
      "detail": "Tesco Cadbury Dairy Milk, 180g; regular price without Clubcard",
      "source": "https://www.tesco.com/shop/en-GB/products/311272207"
    },
    "CA": {
      "price": 6.49,
      "detail": "Metro Cadbury Dairy Milk, 200g; online price before tax",
      "source": "https://www.metro.ca/en/online-grocery/aisles/snacks/sweet-snacks-candy/chocolate/milk-chocolate-bar/p/061200003802"
    }
  },
  "Potato chips": {
    "US": {
      "price": 2.97,
      "detail": "Walmart Lay's Classic Potato Chips, 8 oz; regular price before rollback",
      "source": "https://www.walmart.com/ip/33282303"
    },
    "CA": {
      "price": 3.47,
      "detail": "Walmart Lay's Classic Potato Chips, 235g; online price",
      "source": "https://www.walmart.ca/en/ip/Lay-s-Classic-potato-chips/6000201210244"
    }
  },
  "Orange juice": {
    "AU": {
      "price": 4.2,
      "detail": "Coles Orange Juice, 2L; advertised online price",
      "source": "https://www.coles.com.au/product/coles-juice-orange-2l-2531551?uztq=46abcbb7e16253b0cdc3e6c5bbe6a3f0"
    },
    "US": {
      "price": 3.96,
      "detail": "Walmart Great Value Pasteurized Orange Juice, No Pulp, 52 US fl oz; online price",
      "source": "https://www.walmart.com/ip/403284742"
    },
    "UK": {
      "price": 1.4,
      "detail": "Tesco Smooth Orange Juice, 1L, ambient; regular price before multibuy",
      "source": "https://www.tesco.com/shop/en-GB/products/254859516"
    }
  },
  "Toilet paper": {
    "UK": {
      "price": 8.35,
      "detail": "Tesco Luxury Soft Toilet Tissue, 12 double rolls; regular online price",
      "source": "https://www.tesco.com/shop/en-GB/products/310115609"
    },
    "CA": {
      "price": 7.94,
      "detail": "Walmart Great Value Ultra Soft Toilet Paper, 12 double rolls; one-time purchase",
      "source": "https://www.walmart.ca/en/ip/great-value-ultra-soft-toilet-paper-12-double-equal-24-rolls/10186201"
    },
    "US": {
      "price": 12.96,
      "detail": "Walmart Great Value Ultra Soft Toilet Paper, 12 mega rolls; online price",
      "source": "https://www.walmart.com/ip/1422667978"
    }
  },
  "Dishwashing liquid": {
    "US": {
      "price": 2.94,
      "detail": "Walmart Dawn Ultra Original Dishwashing Liquid, 18 US fl oz; online price",
      "source": "https://business.walmart.com/ip/Dawn-Ultra-Dish-Soap-Dishwashing-Liquid-Original-Scent-18-fl-oz/1095568875?classType=REGULAR"
    },
    "CA": {
      "price": 3.49,
      "detail": "Metro Dawn Ultra Original Dish Soap, 532mL; advertised online price",
      "source": "https://www.metro.ca/en/online-grocery/aisles/household-cleaning/dishwashing/dishwashing-liquid/original-scented-dish-soap/p/037000748342"
    },
    "AU": {
      "price": 6,
      "detail": "Coles Morning Fresh Lemon Dishwashing Liquid, 400mL; regular price before specials",
      "source": "https://www.coles.com.au/product/morning-fresh-lemon-dishwashing-liquid-400ml-2225395"
    },
    "UK": {
      "price": 1,
      "detail": "Tesco Fairy Original Washing Up Liquid, 320mL; advertised online price",
      "source": "https://www.tesco.com/shop/en-GB/products/313518537"
    }
  },
  "Laundry detergent": {
    "AU": {
      "price": 2,
      "detail": "Coles Simply Cotton Fresh Laundry Liquid, 2L; advertised online price",
      "source": "https://www.coles.com.au/product/coles-simply-cotton-fresh-laundry-liquid-2l-1388805"
    }
  },
  "Tissues": {
    "AU": {
      "price": 1.9,
      "detail": "Coles Simply Facial Tissues, one box of 224; advertised online price",
      "source": "https://www.coles.com.au/product/coles-simply-facial-tissues-224-pack-9161519"
    },
    "CA": {
      "price": 1.94,
      "detail": "Walmart Great Value 2-Ply Facial Tissues, one box of 126; one-time purchase",
      "source": "https://www.walmart.ca/en/ip/great-value--facial-tissues--1-flat-box--126-tissues-per-box/6000200007015"
    }
  },
  "AA batteries": {
    "AU": {
      "price": 10.79,
      "detail": "Priceline Energizer MAX AA Alkaline Batteries, 4 pack; advertised online price",
      "source": "https://www.priceline.com.au/product/857246/energizer-max-aa-alkaline-batteries-4-pack"
    },
    "US": {
      "price": 4.97,
      "detail": "Walmart Energizer MAX AA Alkaline Batteries, 4 pack; online price",
      "source": "https://www.walmart.com/ip/13951663976"
    },
    "UK": {
      "price": 4.25,
      "detail": "Tesco Energizer MAX AA Alkaline Batteries, 4 pack; regular online price",
      "source": "https://www.tesco.com/shop/en-GB/products/251568456"
    },
    "CA": {
      "price": 4.67,
      "detail": "Walmart Energizer MAX AA Alkaline Batteries, 4 pack; sold by Walmart, online price",
      "source": "https://www.walmart.ca/en/ip/energizer-max-aa-batteries-4-pack-double-a-alkaline-batteries/6FBLLXWUHPD1"
    }
  },
  "Shampoo": {
    "AU": {
      "price": 10,
      "detail": "Coles Pantene Pro-V Daily Moisture Renewal Shampoo, 375mL; regular price before specials",
      "source": "https://www.coles.com.au/product/pantene-pro-v-shampoo-daily-moisture-renewal-375ml-3723332?bvstate=pg%3A10%2Fct%3Ar"
    },
    "UK": {
      "price": 2.75,
      "detail": "Tesco Pantene Repair & Protect Shampoo, 400mL; regular online price",
      "source": "https://www.tesco.com/shop/en-GB/products/311941401"
    },
    "CA": {
      "price": 5.98,
      "detail": "Walmart Pantene Daily Moisture Renewal Shampoo, 355mL; one-time purchase",
      "source": "https://www.walmart.ca/en/ip/Pantene-Daily-Moisture-Renewal-72-HR-Lush-Moisture-Shampoo/6000204058388"
    },
    "US": {
      "price": 5.49,
      "detail": "Target Pantene Pro-V Daily Moisture Renewal Shampoo, 12 US fl oz; advertised price",
      "source": "https://www.target.com/p/-/A-86503401"
    }
  },
  "Deodorant": {
    "AU": {
      "price": 5.5,
      "detail": "Coles Nivea Pearl & Beauty Roll-On, 50mL; single-item price before multibuy",
      "source": "https://www.coles.com.au/product/nivea-deo-roll-on-female-pearl-and-beauty-50ml-5312077"
    },
    "US": {
      "price": 4.97,
      "detail": "Walmart Ban Unscented Roll-On Antiperspirant, 3.5 US fl oz; online price",
      "source": "https://www.walmart.com/ip/10295374"
    }
  },
  "Razor refills": {
    "AU": {
      "price": 21.5,
      "detail": "Coles Gillette Mach3+ Razor Cartridges, 4 pack; advertised online price",
      "source": "https://www.coles.com.au/product/gillette-mach3%2B-razor-cartridge-4-pack-3793735"
    },
    "UK": {
      "price": 9,
      "detail": "Tesco Gillette Mach3 Razor Blade Refills, 4 pack; regular online price",
      "source": "https://www.tesco.com/shop/en-GB/products/273234259"
    },
    "US": {
      "price": 14.14,
      "detail": "Walmart Gillette Mach3 Razor Blade Refills, 4 pack; online price",
      "source": "https://www.walmart.com/ip/840990584"
    },
    "CA": {
      "price": 14.97,
      "detail": "Walmart Gillette Mach3 Men's Razor Blades, 4 pack; regular price before clearance",
      "source": "https://www.walmart.ca/en/ip/gillette-mach3-mens-razor-blades-not-applicable/6000198042520"
    }
  },
  "Kindle Paperwhite": {
    "AU": {
      "price": 299,
      "detail": "BIG W Kindle Paperwhite (2024), 16GB, black, 7-inch; advertised online price",
      "source": "https://www.bigw.com.au/product/kindle-paperwhite-2024-16gb-black/p/6023679"
    },
    "UK": {
      "price": 159.99,
      "detail": "Argos Kindle Paperwhite (2024), 16GB Wi-Fi, black, 7-inch; advertised online price",
      "source": "https://www.argos.co.uk/product/4462149/"
    }
  },
  "Toothbrush": {
    "AU": {
      "price": 3.29,
      "detail": "BIG W Colgate Extra Clean Medium Toothbrush, single; advertised price",
      "source": "https://www.bigw.com.au/product/colgate-extra-clean-medium-manual-toothbrush-single/p/9901058710"
    },
    "US": {
      "price": 1,
      "detail": "Walmart Colgate Extra Clean Medium Toothbrush, single; online price",
      "source": "https://business.walmart.com/ip/Colgate-Extra-Clean-Toothbrush-Medium/46212473"
    },
    "CA": {
      "price": 1.46,
      "detail": "Walmart Colgate Extra Clean Medium Toothbrush, single; regular price before rollback",
      "source": "https://www.walmart.ca/en/ip/colgate-extra-clean-toothbrush-medium/10220113"
    }
  },
  "Lip balm": {
    "AU": {
      "price": 5,
      "detail": "Coles Nivea Original Care Lip Balm, 4.8g; regular price before specials",
      "source": "https://www.coles.com.au/product/nivea-lip-care-original-4.8g-9479890"
    },
    "UK": {
      "price": 2,
      "detail": "Tesco Nivea Original Care Lip Balm, 4.8g; regular price without Clubcard",
      "source": "https://www.tesco.com/shop/en-GB/search?query=nivea+lip+balm"
    }
  },
  "Hand soap": {
    "AU": {
      "price": 2.2,
      "detail": "Coles Antibacterial Hand Wash Lime Fresh, 250mL; advertised online price",
      "source": "https://www.coles.com.au/product/coles-antibacterial-hand-wash-lime-fresh-250ml-2292858"
    },
    "US": {
      "price": 1.24,
      "detail": "Walmart Softsoap Aquarium Liquid Hand Soap, one 7.5 US fl oz pump; online price",
      "source": "https://www.walmart.com/ip/10323297"
    },
    "CA": {
      "price": 2.38,
      "detail": "Walmart Softsoap Aquarium Liquid Hand Soap, one 221mL pump; online price",
      "source": "https://www.walmart.ca/en/ip/Softsoap-Liquid-Hand-Soap-Pump-Aquarium/6000196692606"
    },
    "UK": {
      "price": 1.65,
      "detail": "Tesco Carex Original Handwash, 250mL; regular price without Clubcard",
      "source": "https://www.tesco.com/shop/en-GB/buylists/19tw37-pz_cussons-carex/carex"
    }
  },
  "Toothpaste tube": {
    "AU": {
      "price": 2.49,
      "detail": "Chemist Warehouse Colgate Cavity Protection Great Regular Toothpaste, 120g; advertised price",
      "source": "https://www.chemistwarehouse.com.au/buy/2629/colgate-toothpaste-cavity-protection-great-regular-120g"
    },
    "CA": {
      "price": 1.44,
      "detail": "Walmart Colgate Cavity Protection Regular Toothpaste, 95mL; regular price before rollback",
      "source": "https://www.walmart.ca/en/ip/Colgate-Cavity-Protection-Fluoride-Toothpaste-Regular/6000195573257?classType=REGULAR"
    },
    "US": {
      "price": 1.97,
      "detail": "Walmart Colgate Cavity Protection Toothpaste, one 6 oz tube; online price",
      "source": "https://www.walmart.com/ip/49714957"
    },
    "UK": {
      "price": 1.5,
      "detail": "Boots Colgate Maximum Cavity Protection Toothpaste, 75mL; advertised price",
      "source": "https://www.boots.com/colgate-cavity-protection-great-regular-flavour-toothpaste-75ml-10171940"
    }
  },
  "Band-Aids box": {
    "AU": {
      "price": 4.49,
      "detail": "Chemist Warehouse Band-Aid Plastic Strips, 50 pack; advertised price",
      "source": "https://www.chemistwarehouse.com.au/buy/32245/band-aid-plastic-strips-50-pack"
    },
    "UK": {
      "price": 3.2,
      "detail": "Boots Elastoplast Everyday Fabric Plasters, assorted, 40 pack; regular price before offers",
      "source": "https://www.boots.com/health-pharmacy/medicines-treatments/first-aid/bandages-dressings-and-plasters/elastoplast-fabric-plasters-40pack-10022346"
    },
    "US": {
      "price": 4.37,
      "detail": "Walmart Band-Aid Flexible Fabric Adhesive Bandages, one-size, 30 count; online price",
      "source": "https://www.walmart.com/ip/10316205"
    }
  },
  "Cotton t-shirt": {
    "UK": {
      "price": 8,
      "detail": "M&S men's Pure Cotton Regular Fit Crew Neck T-Shirt, single; regular price",
      "source": "https://www.marksandspencer.com/l/men/mens-tops/mens-tshirts/fs5/cotton"
    },
    "CA": {
      "price": 7,
      "detail": "Walmart George Men's Crew-Neck T-Shirt, natural; regular online price",
      "source": "https://www.walmart.ca/en/ip/george-mens-crew-neck-t-shirt-natural/1TMX13J313PT"
    }
  },
  "Hoodie": {
    "CA": {
      "price": 18,
      "detail": "Walmart George Men's Fleece Hoodie, black; regular online price",
      "source": "https://www.walmart.ca/en/ip/george-mens-popover-hoodie-black/6000207661848"
    }
  },
  "Socks": {
    "US": {
      "price": 8.98,
      "detail": "Walmart Fruit of the Loom Men's Gameday Crew Socks, 3 pairs, black, sizes 6-12; online price",
      "source": "https://www.walmart.com/ip/19949024083?classType=VARIANT&variantFieldId=actual_color"
    },
    "CA": {
      "price": 10,
      "detail": "Walmart George Men's Crew Socks, 3 pairs, grey; online price",
      "source": "https://www.walmart.ca/en/ip/george-mens-crew-socks-3-pack-grey/6000206663899"
    }
  },
  "Bottled water": {
    "AU": {
      "price": 1,
      "detail": "Coles Natural Spring Water, one 1.5L bottle; online price",
      "source": "https://www.coles.com.au/product/coles-natural-spring-water-1.5l-4874490"
    },
    "US": {
      "price": 3.59,
      "detail": "Target smartwater, one 1.5L bottle; regular advertised price",
      "source": "https://www.target.com/p/-/A-14938750"
    },
    "UK": {
      "price": 0.8,
      "detail": "Tesco Ashbeck still natural mineral water, 2L bottle, listed as Perthshire; online price",
      "source": "https://www.tesco.com/shop/en-GB/products/250602464"
    },
    "CA": {
      "price": 2.49,
      "detail": "Rexall online Nestle Pure Life Spring Water, one 1.5L bottle; delivery listing, fees excluded",
      "source": "https://shop.rexall.ca/store/rexall/products/17877524-pure-life-natural-spring-water-1500-ml"
    }
  },
  "Tea bags": {
    "AU": {
      "price": 1.75,
      "detail": "Coles Simply Quality Black Tea Bags, 100 pack; online price",
      "source": "https://www.coles.com.au/product/coles-simply-quality-black-tea-bags-100-pack-1684954"
    },
    "US": {
      "price": 4.97,
      "detail": "Walmart Lipton Black Tea Bags, 100 count; online price",
      "source": "https://business.walmart.com/ip/Lipton-Black-Tea-Bag-100ct/15177516255?classType=REGULAR"
    },
    "CA": {
      "price": 5.47,
      "detail": "Walmart Red Rose Orange Pekoe Tea, 72 bags; online price",
      "source": "https://www.walmart.ca/en/ip/RR-ORANGE-PEKOE/3UQTKWT7RU7O"
    }
  },
  "Ice cream tub": {
    "UK": {
      "price": 3.25,
      "detail": "Tesco Carte D'Or Vanilla Ice Cream, 900mL; regular online price",
      "source": "https://www.tesco.com/shop/en-GB/products/255708441"
    },
    "US": {
      "price": 4.67,
      "detail": "Walmart Breyers Natural Vanilla Ice Cream, 1.5 US qt tub; online price",
      "source": "https://www.walmart.com/c/brand/breyers-collection"
    },
    "CA": {
      "price": 7.99,
      "detail": "Metro Breyers Creamery Style Natural Vanilla Ice Cream, 1.66L tub; online price",
      "source": "https://www.metro.ca/en/online-grocery/aisles/frozen/ice-cream-treats/ice-cream/natural-vanilla-ice-cream/p/058779133733"
    }
  },
  "Energy drink": {
    "AU": {
      "price": 4.7,
      "detail": "Coles Monster Energy Original Green, 500mL; regular price before specials",
      "source": "https://www.coles.com.au/product/monster-energy-drink-can-green-500ml-2787136"
    },
    "US": {
      "price": 2.69,
      "detail": "Meijer Monster Energy Original Green, one 16 US fl oz can; regular online price",
      "source": "https://www.meijer.com/shopping/product/original-green/7084781116"
    },
    "UK": {
      "price": 2.25,
      "detail": "Tesco Monster Energy Original, one 500mL can; single-item regular price",
      "source": "https://www.tesco.com/shop/en-GB/products/264556669"
    },
    "CA": {
      "price": 3.99,
      "detail": "Metro Monster Energy Original, one 473mL can; advertised price before tax",
      "source": "https://www.metro.ca/en/online-grocery/aisles/beverages/sports-energy-drinks/energy-drinks/original-flavour-energy-drink/p/070847811190"
    }
  },
  "Frozen pizza": {
    "US": {
      "price": 5.97,
      "detail": "Walmart DiGiorno Rising Crust Ultimate Pepperoni Pizza, 24.7 oz; online price",
      "source": "https://www.walmart.com/c/best-sellers/frozen-pizza-rising-crust"
    },
    "CA": {
      "price": 5.98,
      "detail": "Walmart Dr. Oetker Ristorante Mozzarella Pizza, 325g; regular price before rollback",
      "source": "https://www.walmart.ca/en/ip/Dr-Oetker-Ristorante-Mozzarella-Pizza/10260145"
    }
  },
  "USB-C cable": {
    "AU": {
      "price": 29,
      "detail": "Apple 60W USB-C Charge Cable, 1m; regular advertised price",
      "source": "https://www.apple.com/au/shop/iphone/accessories/chargers-adapters/cables"
    },
    "US": {
      "price": 19,
      "detail": "Apple 60W USB-C Charge Cable, 1m; regular advertised price",
      "source": "https://www.apple.com/shop/product/mw493am/a/60w-usb-c-charge-cable-1-m?fnode=53368f7d29e2407ed5206b21801c240e869ab0d315239d99bc0f84f83777e65d59ce48861f9b64b17288ac1bef07189b13eb418ce3b622ff20a0801e1daa57be02ae6220143132b7ec2bf33b7a719654da754e2a7e73378ee7a1d42a1e32d5ec2a23720b3762a6f11e10f82e0b2e592e&fs=fh%3D764e21%252B115c2a%252B3214"
    },
    "UK": {
      "price": 19,
      "detail": "Apple 60W USB-C Charge Cable, 1m; regular advertised price",
      "source": "https://www.apple.com/uk/shop/product/mw493zm/a/60w-usb-c-charge-cable-1m?fnode=3dd737cc26a3022c951462e486c769806cace98e56f30adc75f533b61c131913b7794c6fd6bac47ae077f7e8077d359cb31be426a8c0356dadf25c0bbb66980c192df530c89410346ed91707486a6a6d65d103475f36a30bd37c59d8ad2e6ea091189ec2966d2176cf3d82f31e31c64f&fs=fh%3D7443e7%252B45c4"
    },
    "CA": {
      "price": 25,
      "detail": "Apple 60W USB-C Charge Cable, 1m; regular manufacturer price",
      "source": "https://www.apple.com/ca/shop/product/mw493am/a/60w-usb-c-charge-cable-1-m"
    }
  },
  "Phone case": {
    "AU": {
      "price": 79,
      "detail": "Apple iPhone 16 Silicone Case with MagSafe, Ultramarine; regular advertised price",
      "source": "https://www.apple.com/au/shop/product/MYY63FE/A/iphone-16-silicone-case-with-magsafe-ultramarine"
    },
    "UK": {
      "price": 49,
      "detail": "Apple iPhone 16 Silicone Case with MagSafe, Black; regular advertised price",
      "source": "https://www.apple.com/uk/shop/product/myy13zm/a/iphone-16-silicone-case-with-magsafe-black?fnode=add5d5a75438ee5501ac69377e9efdb41b7d312732e1ee3fd1d10ac3a1e718cc3db239c96828d98aae229015bb36690842b7d8f19c5feb1ed9c25ce8c4b37c7161059441adbbddcb43d17dfe93d4cf3d98bfd3e9f7aea86ef61f966a332d0dc646ded2e3e8ff99bb63c8e477525b3226&fs=fh%3Def684%252B2fe8"
    },
    "US": {
      "price": 49,
      "detail": "Apple iPhone 16 Silicone Case with MagSafe, Black; regular manufacturer price",
      "source": "https://www.apple.com/shop/product/myy13zm/a/iphone-16-silicone-case-with-magsafe-black"
    },
    "CA": {
      "price": 69,
      "detail": "Apple iPhone 16 Silicone Case with MagSafe, Black; regular manufacturer price",
      "source": "https://www.apple.com/ca/shop/product/myy13zm/a/iphone-16-silicone-case-with-magsafe-black"
    }
  },
  "Wireless mouse": {
    "US": {
      "price": 17.99,
      "detail": "Logitech M185 Wireless Mouse, grey, USB receiver; regular manufacturer price",
      "source": "https://www.logi.com/en-us/shop/p/m185-wireless-mouse.910-002225"
    },
    "UK": {
      "price": 12.99,
      "detail": "Logitech M185 Wireless Mouse, grey, USB receiver; current manufacturer price",
      "source": "https://www.logi.com/en-gb/shop/p/m185-wireless-mouse"
    },
    "AU": {
      "price": 22,
      "detail": "JB Hi-Fi Logitech M185 Wireless Mouse, blue; advertised online price",
      "source": "https://www.jbhifi.com.au/products/logitech-m185-wireless-mouse-blue"
    },
    "CA": {
      "price": 24.99,
      "detail": "Logitech M185 Wireless Mouse, grey; regular manufacturer price before offer",
      "source": "https://www.logi.com/en-ca/shop/p/m185-wireless-mouse.910-002225"
    }
  },
  "Levi's 501 jeans": {
    "AU": {
      "price": 139.95,
      "detail": "Levi's men's 501 Original Jeans, style 005010101; regular manufacturer price",
      "source": "https://levis.com.au/products/levis-mens-501-original-jeans-005010101"
    }
  },
  "Electric kettle": {
    "AU": {
      "price": 7.5,
      "detail": "BIG W Contempo Electric Plastic Kettle, 1.7L, white; advertised price",
      "source": "https://www.bigw.com.au/home/appliances/kettles/c/6519108"
    },
    "US": {
      "price": 16.84,
      "detail": "Walmart Mainstays Electric Kettle, 1.7L, white, MS8400778514-3; regular price before rollback",
      "source": "https://www.walmart.com/ip/5158672824"
    },
    "CA": {
      "price": 54.98,
      "detail": "Walmart Black+Decker Stainless Steel Cordless Kettle, 1.7L; online price",
      "source": "https://www.walmart.ca/en/ip/Black-Decker-1-7L-Stainless-Steel-Electric-Cordless-Kettle/6000208258036"
    }
  },
  "Toaster": {
    "AU": {
      "price": 7.5,
      "detail": "BIG W Brilliant Basics 2 Slice Toaster, white; advertised price",
      "source": "https://www.bigw.com.au/home/appliances/toasters/c/6519112"
    },
    "US": {
      "price": 12.33,
      "detail": "Walmart Mainstays 2-Slice Toaster, black, six shade settings; online price",
      "source": "https://www.walmart.com/ip/1233603801"
    },
    "UK": {
      "price": 18,
      "detail": "Argos Cookworks 2 Slice Toaster, stainless steel, 3268681; online price",
      "source": "https://www.argos.co.uk/product/3268681/GM-Variant"
    },
    "CA": {
      "price": 49.37,
      "detail": "Walmart Black & Decker 2-Slice Toaster, black/stainless steel; online price",
      "source": "https://www.walmart.ca/en/ip/black-decker-2-slice-toaster-black/10221861"
    }
  },
  "Pedestal fan": {
    "US": {
      "price": 19.44,
      "detail": "Walmart Mainstays 16-inch 3-Speed Oscillating Pedestal Fan, white; online price",
      "source": "https://www.walmart.com/c/kp/mainstays-16-inch-pedestal-fan"
    },
    "CA": {
      "price": 19.98,
      "detail": "Walmart Mainstays 16-inch Stand Fan, black; sold by Walmart, online price",
      "source": "https://www.walmart.ca/en/ip/mainstays-16-stand-fan-black/6000207032188?selectedSellerId=0"
    }
  },
  "Pillow": {
    "US": {
      "price": 3.44,
      "detail": "Walmart Mainstays Comfort Complete Pillow, Standard/Queen, one pillow; online price",
      "source": "https://www.walmart.com/ip/744932389"
    }
  },
  "Soccer ball": {
    "AU": {
      "price": 10,
      "detail": "Decathlon Kipsta First Kick Football, size 5, white; advertised price",
      "source": "https://www.decathlon.com.au/p/size-5-first-kick-kipsta-8968895.html"
    },
    "US": {
      "price": 18.67,
      "detail": "Walmart Wilson Traditional Soccer Ball, size 5, black/white; online price",
      "source": "https://business.walmart.com/ip/WILSON-Traditional-Black-Size/426033185?classType=REGULAR"
    },
    "CA": {
      "price": 21.99,
      "detail": "Home Hardware Wilson Traditional Soccer Ball, size 5; advertised price",
      "source": "https://www.homehardware.ca/en/traditional-sized-soccer-ball-size-5/p/7152012"
    }
  },
  "Yoga mat": {
    "US": {
      "price": 12.63,
      "detail": "Walmart Athletic Works Printed Yoga Mat, 3mm, 68 x 24 inches; online price",
      "source": "https://business.walmart.com/ip/Athletic-Works-Printed-Yoga-Mat-3mm-68in-long-and-24in-wide-light-weight-durable-slip-resistance/946771649"
    },
    "UK": {
      "price": 10,
      "detail": "Argos Opti PVC Yoga Exercise Mat, 4mm, blue, 8473127; regular price before offers",
      "source": "https://www.argos.co.uk/product/8473127?tag=ar%3Abrowse%3Aclp%3Asportsandleisure%3Am010%3Atop-sports-and-leisure-products"
    }
  },
  "Jigsaw puzzle": {
    "AU": {
      "price": 39.99,
      "detail": "BIG W marketplace Ravensburger Ravensburg Puzzle, 1000 pieces; delivery excluded",
      "source": "https://www.bigw.com.au/product/ravensburger-ravensburg-puzzle-1000-piece/p/9903757680"
    },
    "UK": {
      "price": 14.99,
      "detail": "Ravensburger Books, Bits & Bobs Puzzle, 1000 pieces, 12000284; manufacturer price",
      "source": "https://www.ravensburger.co.uk/en-GB/pdp/12000284"
    },
    "CA": {
      "price": 24.98,
      "detail": "Walmart Ravensburger Disney & Pixar Toy Store Puzzle, 1000 pieces; online price",
      "source": "https://www.walmart.ca/en/ip/RAVENSBURGER-Disney-Pixar-Toy-Store-1000-pc-Puzzle/6000208009277"
    }
  },
  "LEGO set": {
    "AU": {
      "price": 99.99,
      "detail": "LEGO Bonsai Tree 10281, 878 pieces; regular manufacturer price",
      "source": "https://www.lego.com/en-au/product/bonsai-tree-10281?age-gate=grown_up"
    },
    "US": {
      "price": 49.99,
      "detail": "LEGO Bonsai Tree 10281, 878 pieces; regular manufacturer price",
      "source": "https://www.lego.com/en-us/product/bonsai-tree-10281"
    },
    "UK": {
      "price": 44.99,
      "detail": "LEGO Bonsai Tree 10281, 878 pieces; regular manufacturer price",
      "source": "https://www.lego.com/en-gb/product/bonsai-tree-10281"
    },
    "CA": {
      "price": 69.99,
      "detail": "LEGO Bonsai Tree 10281, 878 pieces; regular manufacturer price",
      "source": "https://www.lego.com/en-ca/product/bonsai-tree-10281"
    }
  },
  "Nintendo Switch 2": {
    "AU": {
      "price": 769.95,
      "detail": "Nintendo Switch 2 console only, 256GB; manufacturer suggested price from 1 Sep 2026",
      "source": "https://www.nintendo.com/au/support/articles/price-revision-for-nintendo-switch-2-console/"
    },
    "US": {
      "price": 499.99,
      "detail": "Nintendo Switch 2 console only, 256GB; manufacturer suggested price from 1 Sep 2026",
      "source": "https://www.nintendo.com/us/whatsnew/price-revision-for-nintendo-switch-2-system/"
    },
    "CA": {
      "price": 679.99,
      "detail": "Nintendo Switch 2 console only, 256GB; manufacturer suggested price from 1 Sep 2026",
      "source": "https://www.nintendo.com/en-ca/whatsnew/two-new-nintendo-switch-2-bundles-deliver-sun-soaked-sports-high-speed-thrills-and-extra-value/"
    },
    "UK": {
      "price": 389.99,
      "detail": "Argos Nintendo Switch 2 console only, black, 256GB, 7624867; advertised online price",
      "source": "https://www.argos.co.uk/product/7624867"
    }
  },
  "PlayStation 5": {
    "US": {
      "price": 649.99,
      "detail": "Sony PlayStation 5 Slim, 1TB, disc drive; regular manufacturer price from 2 Apr 2026",
      "source": "https://blog.playstation.com/2026/03/27/new-price-changes-for-ps5-ps5-pro-and-playstation-portal-remote-player"
    },
    "UK": {
      "price": 569.99,
      "detail": "Sony PlayStation 5 Slim, 1TB, disc drive; regular manufacturer price from 2 Apr 2026",
      "source": "https://blog.playstation.com/2026/03/27/new-price-changes-for-ps5-ps5-pro-and-playstation-portal-remote-player"
    },
    "CA": {
      "price": 819.99,
      "detail": "Visions PlayStation 5 Slim, 1TB, disc drive, 1000049888; regular online price",
      "source": "https://www.visions.ca/playstation-5-console-model-group-slim-v2-1000049888"
    }
  },
  "Minced beef": {
    "US": {
      "price": 6.93,
      "detail": "Walmart All Natural Ground Beef Chuck, 80% lean/20% fat, 1 lb tray; online price",
      "source": "https://www.walmart.com/browse/food/ground-beef/976759_9569500_1730435_8361185"
    },
    "UK": {
      "price": 3.25,
      "detail": "Tesco Beef Mince, 20% fat, 500g; regular online price",
      "source": "https://www.tesco.com/shop/en-GB/search?query=beef+mince+500g"
    },
    "CA": {
      "price": 8.92,
      "detail": "Walmart Your Fresh Market Lean Ground Beef, 450g; online price",
      "source": "https://www.walmart.ca/en/ip/Lean-Ground-Beef-Your-Fresh-Market-450-g/6000191288138"
    }
  },
  "Monopoly board game": {
    "AU": {
      "price": 46.95,
      "detail": "BIG W marketplace Monopoly Classic Board Game; advertised price, delivery excluded",
      "source": "https://www.bigw.com.au/product/monopoly-classic-board-game/p/9902597727"
    },
    "US": {
      "price": 22.99,
      "detail": "Staples Hasbro Monopoly Classic Board Game, HG-C1009; advertised price",
      "source": "https://www.staples.com/hasbro-monopoly-classic-game-new-edition-hg-c1009/product_2759018"
    },
    "UK": {
      "price": 24.99,
      "detail": "Chaos Cards Monopoly Classic Board Game; listed RRP before retailer discount",
      "source": "https://www.chaoscards.co.uk/prod/all-board-games/monopoly-classic"
    }
  },
  "Sunscreen bottle": {
    "AU": {
      "price": 21.95,
      "detail": "Cancer Council Ultra Sunscreen SPF50+, 200mL; regular manufacturer price",
      "source": "https://www.cancercouncilshop.org.au/collections/ultra-sunscreen"
    },
    "UK": {
      "price": 5.75,
      "detail": "Boots Soltan Protect & Moisturise Suncare Lotion SPF50+, 200mL; advertised price",
      "source": "https://www.boots.com/soltan-protect-and-moisturise-suncare-lotion-spf50-200ml-10362372"
    },
    "CA": {
      "price": 14.99,
      "detail": "Save-On-Foods Banana Boat Ultra Sport Lotion SPF50, 240mL; regular price before offer",
      "source": "https://www.saveonfoods.com/product/banana-boat-ultra-sport-lotion-spf50-id-00079656030440"
    }
  }
};
 const clone=value=>JSON.parse(JSON.stringify(value));
 const text=value=>typeof value==='string'&&value.length<=1000;
 function validItems(items){
  return Array.isArray(items)&&items.length===4&&new Set(items.map(x=>x&&x.name)).size===4&&items.every(x=>x&&text(x.name)&&text(x.detail)&&text(x.emoji)&&x.prices&&regions.every(r=>Number.isFinite(x.prices[r])&&x.prices[r]>0));
 }
 function current(item,day){
  const out=clone(item);
  if(day<effectiveDay)return out;
  for(const [region,e]of Object.entries(reviewed[item.name]||{})){
   out.prices[region]=e.price;
   (out.priceDetails||={})[region]=e.detail;
   (out.priceEvidence||={})[region]={checkedAt,source:e.source};
  }
  return out;
 }
 function daily(originals,saved,day){
  if(saved)return validItems(saved.items)?clone(saved.items):clone(originals);
  return originals.map(item=>current(item,day));
 }
 function label(item){return item.name==='Pint of beer'&&item.detail.includes('500ml')?'Beer (500ml)':item.name;}
 function detail(item,region){return text(item.priceDetails?.[region])?item.priceDetails[region]:item.detail;}
 function evidence(item,region){
  const e=item.priceEvidence?.[region];
  return e&&/^\d{4}-\d{2}-\d{2}$/.test(e.checkedAt)&&typeof e.source==='string'&&/^https:\/\/[^\s]+$/.test(e.source)?e:null;
 }
 root.BREAK_ROOM_LOWBALL_PRICES=Object.freeze({effectiveDay,checkedAt,current,daily,validItems,label,detail,evidence});
})(typeof window!=='undefined'?window:globalThis);
