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
    },
    "US": {
      "price": 3.7,
      "detail": "Walmart Parmalat UHT Whole Milk: price PER 1 LITRE, prorated from one 32 US fl oz carton (not carton price)",
      "source": "https://www.walmart.com/ip/151857624"
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
    },
    "US": {
      "price": 0.79,
      "detail": "El Super online delivery listing, one Hass avocado; delivery fees and separately added tax excluded",
      "source": "https://www.elsupermarkets.com/store/el-super/products/3251376-hass-avocado-each"
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
    },
    "CA": {
      "price": 1.96,
      "detail": "Metro loose bananas, price for 1kg; advertised unit price",
      "source": "https://www.metro.ca/en/online-grocery/aisles/fruits-vegetables/fruits/bananas-plantains/banana/p/4011"
    },
    "US": {
      "price": 1.1,
      "detail": "Walmart loose fresh bananas: price for 1kg, converted from the retailer's per-pound price and rounded to cents",
      "source": "https://www.walmart.com/ip/44390948"
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
    },
    "US": {
      "price": 21.49,
      "detail": "Disney+ Premium without ads, direct US monthly billing; new listed rate from 21 Oct 2026 billing cycle, tax excluded",
      "source": "https://help.disneyplus.com/article/disneyplus-es-es-price"
    }
  },
  "Breakfast cereal": {
    "US": {
      "price": 4.98,
      "detail": "Walmart Kellogg's Corn Flakes, 18 oz family-size box; online price",
      "source": "https://www.walmart.com/ip/10818608"
    },
    "CA": {
      "price": 6.97,
      "detail": "Walmart Kellogg's Corn Flakes, 600g box; regular price before rollback",
      "source": "https://www.walmart.ca/en/c/brand/kellogg-s-corn-flakes"
    },
    "AU": {
      "price": 2.45,
      "detail": "Coles Simply Corn Flakes, 440g; regular online price",
      "source": "https://www.coles.com.au/product/coles-simply-corn-flakes-440g-6751469"
    },
    "UK": {
      "price": 0.95,
      "detail": "Tesco Corn Flakes, 500g; regular online price",
      "source": "https://www.tesco.com/shop/en-GB/search?query=corn+flake"
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
    },
    "AU": {
      "price": 8,
      "detail": "BIG W Cadbury Dairy Milk Chocolate Block, 180g; advertised price",
      "source": "https://www.bigw.com.au/product/cadbury-dairy-milk-chocolate-block-180g/p/814479"
    },
    "US": {
      "price": 4.79,
      "detail": "Target Hershey's Milk Chocolate Giant Candy Bar, 7.56 oz; advertised price",
      "source": "https://www.target.com/p/-/A-80316575"
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
    },
    "AU": {
      "price": 5.25,
      "detail": "BIG W Smith's Original Crinkle Cut Potato Chips, 170g bag; regular online price",
      "source": "https://www.bigw.com.au/product/smith-s-crinkle-cut-potato-potato-chips-original-170g/p/826730"
    },
    "UK": {
      "price": 1.5,
      "detail": "Tesco Walkers Ready Salted Sharing Crisps, 175g bag; regular online price",
      "source": "https://www.tesco.com/shop/en-GB/products/295652554"
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
    },
    "CA": {
      "price": 6.49,
      "detail": "Metro Tropicana Pure Premium 100% Orange Juice, 1.54L; advertised price",
      "source": "https://www.metro.ca/en/online-grocery/aisles/beverages/juices-drinks/refrigerated-juices-drinks/100-pure-orange-juice/p/048500203545"
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
    },
    "AU": {
      "price": 9.5,
      "detail": "Coles So Soft 4-ply Toilet Paper, 12-pack; regular online price",
      "source": "https://www.coles.com.au/browse/cleaning-laundry/toilet-paper-tissues-paper-towels/toilet-paper"
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
    },
    "UK": {
      "price": 2.99,
      "detail": "Tesco Non Bio Super Concentrated Liquid Detergent, 60 washes, 1.5L; regular price",
      "source": "https://www.tesco.com/groceries/en-GB/products/315965401"
    },
    "CA": {
      "price": 4.97,
      "detail": "Walmart Great Value OXI 4-in-1 Liquid Laundry Detergent, 43 washes, 1.92L; one-time price",
      "source": "https://www.walmart.ca/en/ip/Great-Value-Liquid-Laundry-Detergent-OXI-4-in-1-43-wash-1-92L/2DCC865C1BOU?classType=REGULAR"
    },
    "US": {
      "price": 8.24,
      "detail": "Walmart Tide Simply Refreshing Breeze liquid detergent, 84 US fl oz / 64 loads; advertised price before tax",
      "source": "https://www.walmart.com/ip/5057509914"
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
    },
    "UK": {
      "price": 0.9,
      "detail": "Tesco Springforce Facial Tissues, one 180-sheet 2-ply box; listed price",
      "source": "https://www.tesco.com/shop/en-GB/products/315842057"
    },
    "US": {
      "price": 1.93,
      "detail": "Walmart Great Value Soft Facial Tissues; SINGLE 160-tissue 2-ply flat carton variant, listed regular price, tax excluded",
      "source": "https://www.walmart.com/ip/173095972"
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
    },
    "UK": {
      "price": 4.4,
      "detail": "Notino Nivea Pearl & Beauty Roll-On, 50mL; regular price without discount code",
      "source": "https://www.notino.co.uk/nivea/pearl-beauty-roll-on-antiperspirant/"
    },
    "CA": {
      "price": 5.97,
      "detail": "Walmart Ban Unscented roll-on antiperspirant deodorant, 100mL; advertised price before tax",
      "source": "https://www.walmart.ca/en/c/brand/ban"
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
    },
    "US": {
      "price": 159.99,
      "detail": "Best Buy Amazon Kindle Paperwhite, 2024 16GB Black, B0CFPJYX7P; advertised price before tax",
      "source": "https://www.bestbuy.com/site/amazon-kindle-paperwhite-16-gb-2024-black/6602737.p"
    },
    "CA": {
      "price": 279.99,
      "detail": "Best Buy Amazon Kindle Paperwhite, 12th Gen, 7-inch, 16GB Black, 18487161; advertised price before tax",
      "source": "https://www.bestbuy.ca/en-ca/product/amazon-kindle-paperwhite-12th-gen-7-digital-ereader-16gb-for-poolside-reading-black/18487161"
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
    },
    "UK": {
      "price": 1.5,
      "detail": "Boots Colgate Extra Clean Medium Toothbrushes, THREE-PACK, 10345319; listed price",
      "source": "https://www.boots.com/colgate/colgate-manual-toothbrushes/colgate-extra-clean-toothbrush-10345319"
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
    },
    "CA": {
      "price": 4.68,
      "detail": "Walmart Blistex Complete Moisture Lip Balm, 4.25g single; one-time price",
      "source": "https://www.walmart.ca/en/ip/Blistex-Complete-Moisture-Lip-Balm/6000191025951?selectedSellerId=0"
    },
    "US": {
      "price": 3.89,
      "detail": "Target ChapStick Classic Original lip balm, 3 sticks / 0.45oz total; pack price, not one stick; tax excluded",
      "source": "https://www.target.com/s/original%2Bchapstick"
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
    },
    "CA": {
      "price": 7.99,
      "detail": "Rexall online delivery listing, Band-Aid Flexible Fabric BR45, 30 count; tax and delivery fees excluded",
      "source": "https://shop.rexall.ca/store/rexall/products/24508485-br45-flex-fab-band-30-ct"
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
    },
    "AU": {
      "price": 19.9,
      "detail": "UNIQLO U Cotton Crew Neck T-Shirt, unisex; regular price",
      "source": "https://www.uniqlo.com/au/en/women/tops/t-shirts"
    },
    "US": {
      "price": 14,
      "detail": "Hanes Beefy-T Unisex Pocket T-Shirt, style 5190; regular price before offer",
      "source": "https://www.hanes.com/products/hanes-beefy-t-pocket-t-shirt-h5190/5190"
    }
  },
  "Hoodie": {
    "CA": {
      "price": 18,
      "detail": "Walmart George Men's Fleece Hoodie, black; regular online price",
      "source": "https://www.walmart.ca/en/ip/george-mens-popover-hoodie-black/6000207661848"
    },
    "UK": {
      "price": 35,
      "detail": "M&S Cotton Rich Hoodie, product clp60750422; regular advertised price",
      "source": "https://www.marksandspencer.com/cotton-rich-hoodie/p/clp60750422"
    },
    "US": {
      "price": 28,
      "detail": "Hanes EcoSmart Unisex Full-Zip Fleece Hoodie; listed regular price before offer, tax excluded",
      "source": "https://www.hanes.com/"
    },
    "AU": {
      "price": 14,
      "detail": "BIG W Allgood Men’s Basic Hoodie, black; advertised online price",
      "source": "https://www.bigw.com.au/mens-clothing-accessories/mens-clothing/hoodies-sweatshirts/c/6812105"
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
    },
    "AU": {
      "price": 2.75,
      "detail": "BIG W Brilliant Basics men's trainer socks, three pairs, black, size 7-12; regular price",
      "source": "https://www.bigw.com.au/product/brilliant-basics-mens-trainer-socks-3-pack-black/p/1604345-black"
    },
    "UK": {
      "price": 10,
      "detail": "M&S Thermal Sumptuously Soft Ankle High Socks, three pairs, clp60194371; regular price",
      "source": "https://www.marksandspencer.com/3-pair-pack-sumptuously-soft-ankle-high-socks/p/clp60194371"
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
    },
    "UK": {
      "price": 1.39,
      "detail": "Tesco Decaff Original Tea, 80 bags, 250g; regular online price",
      "source": "https://www.tesco.com/shop/en-GB/products/250712610"
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
    },
    "AU": {
      "price": 13,
      "detail": "Coles Connoisseur Classic Vanilla Ice Cream Tub, 1L; regular online price",
      "source": "https://www.coles.com.au/brands/connoisseur-3829372172"
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
    },
    "UK": {
      "price": 3.25,
      "detail": "Tesco Dr. Oetker Ristorante Mozzarella Pizza, 335g; regular price before Clubcard offers",
      "source": "https://www.tesco.com/shop/en-GB/buylists/ristorante-ttw/ristorante-ttw/ristorante-ttw"
    },
    "AU": {
      "price": 9.5,
      "detail": "Coles Dr Oetker Ristorante Mozzarella frozen pizza, 355g; Coles listed reference reported by Grovena, not the cheapest competing store",
      "source": "https://grovena.com.au/product/10174-dr-oetker-ristorante-mozzarella-pizza-355g"
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
    },
    "CA": {
      "price": 118,
      "detail": "Levi's Canada Premium 501 Original Men's Jeans; listed original price before promotional discounts, tax excluded",
      "source": "https://www.levi.com/CA/en_CA/jeans-by-fit-number/men/jeans/501/501-original/c/levi_jeans_by_fit_number_men_jeans_501_original/facets/feature-fit_name/501%C2%AE"
    },
    "UK": {
      "price": 110,
      "detail": "Levi's UK 501 Original Jeans; advertised regular price",
      "source": "https://www.levi.com/GB/en_GB/levis-501/c/levi_clothing_501"
    },
    "US": {
      "price": 79.5,
      "detail": "Levi’s US 501 Original Fit Men’s Jeans, style 005013406; listed original price before sale, tax excluded",
      "source": "https://www.levi.com/US/en_US/clothing/men/jeans/straight/501-original-fit-mens-jeans/p/005013406"
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
    },
    "UK": {
      "price": 9,
      "detail": "Argos Cookworks Kettle, white, 1.7L, product 3362910; advertised price, delivery excluded",
      "source": "https://www.argos.co.uk/product/3362910/"
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
    },
    "AU": {
      "price": 17,
      "detail": "BIG W Brilliant Basics Pedestal Fan, 40cm White; advertised online price",
      "source": "https://www.bigw.com.au/home/appliances/fans/pedestal-fans/c/65191050206"
    },
    "UK": {
      "price": 75,
      "detail": "Argos Philips White Pedestal Fan, 15-inch, product 7631582; advertised price, delivery excluded",
      "source": "https://www.argos.co.uk/product/7631582"
    }
  },
  "Pillow": {
    "US": {
      "price": 3.44,
      "detail": "Walmart Mainstays Comfort Complete Pillow, Standard/Queen, one pillow; online price",
      "source": "https://www.walmart.com/ip/744932389"
    },
    "UK": {
      "price": 5,
      "detail": "Argos Home Essentials Everyday Soft Pillows, two-pack, 7878039; advertised price",
      "source": "https://www.argos.co.uk/product/7878039?clickSR=slp%3Aterm%3Afrozen+bedding%3A1444%3A3202%3A2"
    },
    "CA": {
      "price": 4.47,
      "detail": "Walmart Mainstays Comfort Complete Standard Bed Pillow, white, one pillow; online price",
      "source": "https://www.walmart.ca/en/ip/mainstays-comfort-complete-white/4BSLC5VWVT0I?selectedSellerId=0"
    },
    "AU": {
      "price": 43,
      "detail": "BIG W Tontine Big & Bouncy Pillow, one pillow; regular price before half-price offer",
      "source": "https://www.bigw.com.au/home/bedding/pillows-pillowcases/pillows/c/6512103"
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
    },
    "UK": {
      "price": 4.99,
      "detail": "Decathlon Kipsta Size 5 Football, yellow, ID 8676298; advertised price, shipping excluded",
      "source": "https://www.decathlon.co.uk/p/size-5-football-yellow/334351/c22m8676298"
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
    },
    "CA": {
      "price": 15,
      "detail": "Decathlon Kimjaly Gentle Yoga Mat Essential, 4mm; regular advertised price",
      "source": "https://www.decathlon.ca/en/p/gentle-yoga-mat-4-mm-essential/141487/c117m8506526"
    },
    "AU": {
      "price": 26.99,
      "detail": "Bunnings marketplace, sold by Decathlon Australia; Essential yoga mat 172×58cm, 4mm, dark green; delivery excluded",
      "source": "https://www.bunnings.com.au/decathlon-essential-yoga-mat-172cm-x-58cm-x-4mm-dark-green-one-size_p1114530"
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
    },
    "US": {
      "price": 11.93,
      "detail": "Walmart Buffalo Games Chuck Pinson Cottage by the Sea, 1000-piece jigsaw; online price",
      "source": "https://www.walmart.com/ip/685531241"
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
    },
    "AU": {
      "price": 999,
      "detail": "JB Hi-Fi PlayStation 5 Slim Console, 1TB, disc drive; advertised price",
      "source": "https://www.jbhifi.com.au/products/ps5-playstation-5-slim-console"
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
    },
    "AU": {
      "price": 7.7,
      "detail": "Coles No Added Hormone Beef Regular Mince, 500g tray; regular online price",
      "source": "https://www.coles.com.au/product/coles-no-added-hormone-beef-regular-mince-500g-9012814"
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
    },
    "CA": {
      "price": 27.99,
      "detail": "Best Buy Monopoly Classic, Hasbro barcode 195166286488; listed offer reported by Shopbot Canada, tax and shipping excluded",
      "source": "https://www.shopbot.ca/product/Monopoly-Classic-Board-Game.html"
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
    },
    "US": {
      "price": 3.5,
      "detail": "Five Below Banana Boat Sport Ultra SPF50 Sunscreen Lotion, 8 US fl oz; advertised price",
      "source": "https://www.fivebelow.com/products/banana-boat-sport-ultra-spf50-sunscreen-lotion-8oz-9235220"
    }
  },
  "Nike Air Force 1": {
    "AU": {
      "price": 180,
      "detail": "Nike men's Air Force 1 '07, White/White, CW2288-111; regular manufacturer price",
      "source": "https://www.nike.com/au/t/air-force-1-07-mens-shoes-cvS6DOBf/CW2288-111"
    },
    "US": {
      "price": 115,
      "detail": "Nike men's Air Force 1 '07, White/White, CW2288-111; regular manufacturer price",
      "source": "https://www.nike.com/t/air-force-1-07-mens-shoes-XVPIszaq/CW2288-111"
    },
    "UK": {
      "price": 109.99,
      "detail": "Nike men's Air Force 1 '07, Black/White, CT2302-002; regular manufacturer price",
      "source": "https://www.nike.com/gb/t/air-force-1-07-herrenschuh-n8juM1H2/CT2302-002"
    },
    "CA": {
      "price": 150,
      "detail": "Nike men's Air Force 1 '07, White/White, CW2288-111; regular manufacturer price",
      "source": "https://www.nike.com/ca/t/air-force-1-07-mens-shoes-8MPI3T2W/CW2288-111"
    }
  },
  "Zoo ticket": {
    "AU": {
      "price": 57,
      "detail": "Taronga Zoo Sydney, standard adult gate admission; no online discount",
      "source": "https://www.taronga.org.au/sydney-zoo/plan/visitor-information/ticket-prices"
    },
    "US": {
      "price": 22.95,
      "detail": "Central Park Zoo, New York, adult 13+, Zoo Admission including one 4-D Theater entry",
      "source": "https://centralparkzoo.com/plan-your-visit/hours-and-rates"
    },
    "UK": {
      "price": 31.8,
      "detail": "London Zoo, adult 16-64, Standard day online before 10am; no voluntary donation",
      "source": "https://www.londonzoo.org/plan-your-visit/london-zoo-tickets"
    },
    "CA": {
      "price": 38,
      "detail": "Greater Vancouver Zoo, Aldergrove BC; adult age 18–64 day admission, parking and train excluded; separately added tax excluded",
      "source": "https://gvzoo.com/visit/hours-rates-getting-here/"
    }
  },
  "Gym membership": {
    "AU": {
      "price": 51.5,
      "detail": "KGV Recreation Centre, The Rocks, Sydney: standard gym pass, non-contract fortnightly debit (two weeks)",
      "source": "https://www.cityofsydney.nsw.gov.au/gyms/kgv-gym"
    },
    "CA": {
      "price": 7.99,
      "detail": "Fit4Less 4Less Card, advertised recurring dues every TWO WEEKS, before tax and annual/joining fees",
      "source": "https://www.fit4less.ca/"
    },
    "UK": {
      "price": 27.99,
      "detail": "The Gym Group Walthamstow, Off-peak plan; advertised starting monthly dues only, one-off joining fee excluded",
      "source": "https://www.thegymgroup.com/find-a-gym/east-london-gyms/walthamstow/"
    },
    "US": {
      "price": 15,
      "detail": "Planet Fitness Classic membership; advertised US starting monthly dues only, joining/annual fees and tax excluded; location prices vary",
      "source": "https://www.planetfitness.com/gym-memberships"
    }
  },
  "Haircut": {
    "AU": {
      "price": 51,
      "detail": "Sydney Barbers, Sydney CBD: Signature cut, 20 minutes; listed service price",
      "source": "https://sydneybarbers.com.au/services"
    },
    "CA": {
      "price": 40,
      "detail": "Crowsnest Barbershop, Anndore House, 15 Charles St East, Toronto: Cut; before tax/tip",
      "source": "https://www.crowsnestbarbershop.com/toronto-anndore"
    },
    "US": {
      "price": 40,
      "detail": "Signature Barbershop, 164 E 56th St NYC; Regular Haircut & Style, 20 minutes; tax and tip excluded",
      "source": "https://signaturebarbershopnyc.setmore.com/"
    },
    "UK": {
      "price": 25,
      "detail": "Barber House, 212 West End Lane London; Gents cut with style, finish, ears and brows, 25 minutes; no skin fade",
      "source": "https://booksy.com/en-gb/113171_barber-house_barber_311817_london"
    }
  },
  "Dry cleaning": {
    "AU": {
      "price": 13,
      "detail": "WashMate Surry Hills/Leichhardt, Sydney: business shirt dry cleaned, starting price; delivery excluded",
      "source": "https://washmate.com.au/dry-cleaning-prices-sydney-guide/"
    },
    "US": {
      "price": 22,
      "detail": "Clean NYC: one shirt/blouse DRY CLEANED, not laundered; before tax/delivery",
      "source": "https://www.clean.nyc/price-list"
    },
    "UK": {
      "price": 4.99,
      "detail": "Pimlico Dry Cleaners, London: Shirt DRY CLN; listed garment price, delivery excluded",
      "source": "https://pimlicodrycleaners.co.uk/pricing/"
    },
    "CA": {
      "price": 7.99,
      "detail": "Door2Door Toronto: dry-cleaned shirt unit price within a $50 minimum order; before tax/delivery",
      "source": "https://door2doordrycleaning.ca/pricing/"
    }
  },
  "Car wash": {
    "UK": {
      "price": 15,
      "detail": "Park Royal Car Wash, London: Bronze outside-only wash, small/medium car; listed service price",
      "source": "https://www.parkroyalcarwash.com/prices"
    },
    "AU": {
      "price": 19,
      "detail": "Kwik & Ezy, 2 Crescent Ave Taree NSW; one Express automatic wash",
      "source": "https://kwiknezytaree.com.au/services/"
    },
    "US": {
      "price": 10,
      "detail": "Mister Car Wash, 1009 Del Prado Blvd S, Cape Coral FL; Base Exterior single wash, branch menu checked 17 Oct 2026 by CarWashCompass; tax excluded",
      "source": "https://carwashcompass.com/stores/mister-car-wash-cape-coral-fl-3ca2230317"
    },
    "CA": {
      "price": 16.99,
      "detail": "Petro-Canada single car wash ticket; published website reference price, local prices and tax may differ",
      "source": "https://www.petro-canada.ca/en/personal/car-wash"
    }
  },
  "Public transport fare": {
    "US": {
      "price": 3,
      "detail": "New York MTA subway/local bus, adult base fare with OMNY, effective 4 Jan 2026",
      "source": "https://www.mta.info/document/186881"
    },
    "UK": {
      "price": 1.75,
      "detail": "London TfL adult bus/tram pay-as-you-go Hopper fare, as at 22 Oct 2026 (before 1 Nov rise)",
      "source": "https://tfl.gov.uk/fares/find-fares/bus-and-tram-fares?intcmp=79996"
    },
    "CA": {
      "price": 3.35,
      "detail": "Toronto TTC adult one-way CASH fare; exact change, not PRESTO discounted fare",
      "source": "https://www.ttc.ca/en/Fares-and-passes"
    },
    "AU": {
      "price": 22.94,
      "detail": "Sydney AirportLink adult peak Opal/contactless fare between city and an airport station; rail journey plus station Gate Pass, published June 2026 tariff",
      "source": "https://airportlink.com.au/trip-information/price/"
    }
  },
  "Sunglasses": {
    "AU": {
      "price": 29.9,
      "detail": "UNIQLO Rectangle Sunglasses, unisex; regular advertised price",
      "source": "https://www.uniqlo.com/au/en/women/accessories/sunglasses"
    },
    "US": {
      "price": 24.9,
      "detail": "UNIQLO Rectangle Sunglasses, unisex; regular advertised price",
      "source": "https://www.uniqlo.com/us/en/women/accessories-and-shoes/sunglasses"
    },
    "UK": {
      "price": 19.9,
      "detail": "UNIQLO Rectangle Sunglasses, unisex; regular advertised price",
      "source": "https://www.uniqlo.com/uk/en/women/uv-protection/accessories"
    },
    "CA": {
      "price": 29.9,
      "detail": "UNIQLO Rectangle Sunglasses, unisex; regular advertised price",
      "source": "https://www.uniqlo.com/ca/en/women/uv-protection/sunglasses"
    }
  },
  "Backpack": {
    "AU": {
      "price": 31.99,
      "detail": "Decathlon Quechua NH Arpenaz 100, 20L hiking backpack; Bunnings marketplace, delivery excluded",
      "source": "https://www.bunnings.com.au/decathlon-hiking-backpack-20-l-nh-arpenaz-100-20l_p0648196"
    },
    "UK": {
      "price": 11.99,
      "detail": "Decathlon Quechua NH100 Arpenaz, 20L, blue; regular price before offers",
      "source": "https://www.decathlon.co.uk/p/20-l-hiking-backpack-nh100-arpenaz-blue/_/R-p-301674?c=blue"
    },
    "US": {
      "price": 25.09,
      "detail": "Eastsport Aero Core Backpack; advertised manufacturer online price before tax and shipping",
      "source": "https://eastsport.com/collections/backpacks"
    },
    "CA": {
      "price": 24.97,
      "detail": "Walmart George 3-piece backpack set with water bottle and pencil case; listed regular price before clearance, tax excluded",
      "source": "https://www.walmart.ca/en/ip/George-multi-piece-Backpack-Set/6000201080049"
    }
  },
  "Bluetooth speaker": {
    "US": {
      "price": 149.95,
      "detail": "JBL Flip 7 portable Bluetooth speaker; regular manufacturer price before offers",
      "source": "https://www.jbl.com/FLIP-7.html?dwvar_FLIP-7_color=Sand-AM-Current"
    },
    "UK": {
      "price": 129,
      "detail": "Currys JBL Flip 7 portable Bluetooth speaker, black; regular advertised price",
      "source": "https://www.currys.co.uk/products/jbl-flip-7-portable-bluetooth-speaker-black-10278564.html"
    },
    "CA": {
      "price": 189.99,
      "detail": "Canada Computers JBL Flip 7 portable Bluetooth speaker, black; advertised price",
      "source": "https://www.canadacomputers.com/en/portable-bluetooth-speakers/278274/jbl-flip-7-portable-bluetooth-speaker-black-jblflip7blkam.html"
    },
    "AU": {
      "price": 179.95,
      "detail": "JBL Flip 7 portable Bluetooth speaker; listed Australian regular manufacturer price before sale",
      "source": "https://www.jbl.com.au/bluetooth-speakers/FLIP-7.html"
    }
  },
  "Cat food": {
    "AU": {
      "price": 13,
      "detail": "Coles Whiskas Favourites Mixed in Gravy, twelve 85g pouches; regular online price",
      "source": "https://www.coles.com.au/product/whiskas-favourites-mixed-in-gravy-cat-food-12x85g-12-pack-5172626"
    },
    "UK": {
      "price": 4,
      "detail": "Tesco Whiskas 1+ Pure Delight Fish & Meat Selection, twelve 85g pouches; online price",
      "source": "https://www.tesco.com/groceries/en-GB/products/302295349"
    },
    "US": {
      "price": 0.99,
      "detail": "Family Dollar via Instacart, Purina Friskies Pâté Mixed Grill wet cat food, one 5.5 oz can; tax and delivery fees excluded",
      "source": "https://www.instacart.com/products/38854-friskies-pate-wet-cat-food-pate-mixed-grill-5-5-oz?retailerSlug=family-dollar"
    },
    "CA": {
      "price": 0.99,
      "detail": "Food Basics Friskies Pâté Chicken wet cat food, one 156g can; regular price before separately added tax",
      "source": "https://www.foodbasics.ca/aisles/pet-care/cats/canned-cat-food/chicken-wet-cat-food/p/056366006866"
    }
  },
  "Dog food bag": {
    "CA": {
      "price": 24.98,
      "detail": "Walmart Pedigree Vitality+ roasted chicken & vegetable dry adult dog food, 8kg; one-time purchase",
      "source": "https://www.walmart.ca/en/ip/PEDIGREE-VITALITY-Dry-Food-For-Adult-Dogs-Roasted-Chicken-Vegetable-Flavour-Supports-Strong-Bones-and-Healthy-Teeth-With-Calcium/10036440"
    },
    "AU": {
      "price": 15,
      "detail": "Coles Pedigree Adult Dry Dog Food with Real Beef, 3kg; regular online price",
      "source": "https://www.coles.com.au/product/pedigree-adult-dry-dog-food-with-real-beef-3kg-7976078"
    },
    "US": {
      "price": 5,
      "detail": "Tractor Supply via Instacart, Pedigree Complete Nutrition Adult Roasted Chicken & Vegetable, 3.5 lb bag; tax and delivery fees excluded",
      "source": "https://www.instacart.com/products/37704-pedigree-complete-nutrition-adult-dry-dog-food-roasted-chicken-rice-vegetable-flavor-3-5-lb?retailerSlug=tractor-supply"
    },
    "UK": {
      "price": 7.99,
      "detail": "Pets at Home Pedigree Complete Adult Poultry & Vegetables dry dog food, 3kg; one-time purchase, no subscription discount",
      "source": "https://www.petsathome.com/product/7145016P?productId=7145016&purchaseType=one-time&weight=3kg"
    }
  },
  "Paperback novel": {
    "US": {
      "price": 18,
      "detail": "Barnes & Noble The Thursday Murder Club by Richard Osman, standard paperback; listed price",
      "source": "https://www.barnesandnoble.com/w/the-thursday-murder-club-richard-osman/1136398985"
    },
    "CA": {
      "price": 24.95,
      "detail": "Indigo The Thursday Murder Club Netflix Tie-In by Richard Osman, paperback (2025); listed price",
      "source": "https://www.indigo.ca/products/the-thursday-murder-club-netflix-tie-in"
    },
    "AU": {
      "price": 24.99,
      "detail": "Richard Osman, The Thursday Murder Club; paperback ISBN 9781405985840, Penguin Australia publisher RRP",
      "source": "https://www.penguin.com.au/books/the-thursday-murder-club-9781405985840"
    },
    "UK": {
      "price": 9.99,
      "detail": "Richard Osman, The Thursday Murder Club; paperback ISBN 9780241988268, Penguin UK publisher price",
      "source": "https://www.penguin.co.uk/books/315815/the-thursday-murder-club-by-osman-richard/9780241988268"
    }
  },
  "Bottle of wine": {
    "US": {
      "price": 5.99,
      "detail": "Total Wine Yellow Tail Shiraz, 750mL; single-bottle price, not Mix 6",
      "source": "https://www.totalwine.com/wine/red-wine/syrahshiraz/yellow-tail-shiraz/p/93193750"
    },
    "UK": {
      "price": 9.95,
      "detail": "Co-op Yellow Tail Shiraz, 75cL; single-bottle listed price",
      "source": "https://www.coop.co.uk/products/yellow-tail-shiraz-841906"
    },
    "AU": {
      "price": 9.99,
      "detail": "Dan Murphy’s Yellow Tail Shiraz, one 750mL bottle; listed single-bottle price, no six-bottle discount",
      "source": "https://www.danmurphys.com.au/product/DM_904872"
    },
    "CA": {
      "price": 14.95,
      "detail": "LCBO Yellow Tail Shiraz, one 750mL bottle, SKU 624544; advertised Ontario price, delivery excluded",
      "source": "https://www.lcbo.com/en/yellow-tail-shiraz-624544"
    }
  },
  "Six-pack of beer": {
    "CA": {
      "price": 17.95,
      "detail": "LCBO Corona Extra, six 330mL bottles; listed pack price",
      "source": "https://www.lcbo.com/en/corona-extra-17818"
    },
    "UK": {
      "price": 8,
      "detail": "Tesco Peroni Nastro Azzurro, 6×330mL bottles; regular online price",
      "source": "https://www.tesco.com/shop/en-GB/products/303434530"
    },
    "US": {
      "price": 9.49,
      "detail": "Total Wine & More Corona Extra Mexican Lager, 6×12 US fl oz bottles; listed online price before tax and any deposit",
      "source": "https://www.totalwine.com/beer/brand/corona"
    },
    "AU": {
      "price": 23.49,
      "detail": "Dan Murphy’s Victoria Bitter Lager CANS, 6×375mL; advertised six-pack price, not bottle/case or member multibuy",
      "source": "https://www.danmurphys.com.au/list/victoria-bitter"
    }
  },
  "Coffee capsules box": {
    "US": {
      "price": 9.79,
      "detail": "Target Peet's Caramel Dark Roast Espresso Capsules, 10 count, Nespresso Original compatible; regular price before sale",
      "source": "https://www.target.com/c/espresso-coffee-beverages-grocery/peet-s-coffee/-/N-2dpp9Z8romv"
    },
    "CA": {
      "price": 12.99,
      "detail": "Food Basics Starbucks Dark Roast Nespresso Espresso coffee pods, 10 capsules; listed regular price before offer",
      "source": "https://www.foodbasics.ca/aisles/beverages/coffee/coffee-pods/dark-roast-nespresso-espresso-coffee-pods/p/8445291834736"
    },
    "AU": {
      "price": 8.6,
      "detail": "Coles Starbucks by Nespresso Blonde Espresso Roast, 10 capsules; single-pack regular price, no multibuy",
      "source": "https://www.coles.com.au/product/starbucks-by-nespresso-blonde-espresso-roast-capsules-10-pack-3613061"
    },
    "UK": {
      "price": 4.6,
      "detail": "Tesco Starbucks by Nespresso Espresso Roast, 10 capsules / 57g; regular non-Clubcard single-pack price",
      "source": "https://www.tesco.com/shop/en-GB/products/316196290"
    }
  },
  "PS5 game": {
    "US": {
      "price": 59.99,
      "detail": "PlayStation Store ASTRO BOT, PS5 Standard Edition digital; full price",
      "source": "https://www.playstation.com/en-us/games/astro-bot/"
    },
    "UK": {
      "price": 59.99,
      "detail": "PlayStation Store ASTRO BOT, PS5 Standard Edition digital; full price",
      "source": "https://www.playstation.com/en-gb/games/astro-bot/"
    },
    "CA": {
      "price": 79.99,
      "detail": "PlayStation Store ASTRO BOT, PS5 Standard Edition digital; full price",
      "source": "https://store.playstation.com/en-ca/concept/10002684"
    },
    "AU": {
      "price": 109.95,
      "detail": "PlayStation Store Australia ASTRO BOT, PS5 standard digital edition; regular price",
      "source": "https://store.playstation.com/en-au/product/EP9000-PPSA21567_00-0000000000000000"
    }
  },
  "Flat white": {
    "US": {
      "price": 4.1,
      "detail": "Frenchy Coffee NYC, Flat White, 8 US fl oz; menu price before tax/tip",
      "source": "https://frenchycoffeenyc.com/food-menu"
    },
    "CA": {
      "price": 4.5,
      "detail": "Petit Delights, Scarborough, Toronto: Flat White, 8 oz; menu price before tax/tip",
      "source": "https://petitdelights.ca/ajax-petit-delights/"
    },
    "UK": {
      "price": 3.5,
      "detail": "No 1 Coffee London, Flat White 8oz; Uber Eats menu price, delivery and service fees excluded",
      "source": "https://www.ubereats.com/gb/store/no-1-coffee-london/dQeQIaU6Uka8pwkaEb5y3A"
    },
    "AU": {
      "price": 5,
      "detail": "Hester’s Sydney CBD, Flat White; first-listed standard coffee serving with regular milk, extras excluded",
      "source": "https://www.hesters.com.au/menu"
    }
  },
  "External SSD": {
    "US": {
      "price": 274.99,
      "detail": "Samsung T7 Portable SSD 1TB, MU-PC1T0T/AM; manufacturer MSRP effective June 2026",
      "source": "https://images.samsung.com/is/content/samsung/assets/us/business/solutions/industries/government/msrp-price-sheets/SamsungMemory_StorageMSRPPriceFileJune2026.pdf"
    },
    "AU": {
      "price": 499,
      "detail": "Officeworks Samsung T7 portable SSD, 1TB Grey, SASSD1TBGY; advertised online price",
      "source": "https://www.officeworks.com.au/shop/officeworks/p/samsung-t7-portable-ssd-drive-1tb-grey-sassd1tbgy"
    },
    "UK": {
      "price": 239.99,
      "detail": "Currys Samsung T7 portable external SSD, 1TB Blue, 10217183; advertised online price",
      "source": "https://www.currys.co.uk/products/samsung-t7-portable-external-ssd-1-tb-blue-10217183.html"
    },
    "CA": {
      "price": 374.99,
      "detail": "Best Buy Samsung T7 1TB Grey, MU-PC1T0T/AM; advertised 1TB variant price before tax",
      "source": "https://www.bestbuy.ca/en-ca/product/samsung-t7-1tb-usb-3-2-external-solid-state-drive-mu-pc1t0t-am-grey-english/14683402"
    }
  },
  "LED light bulb": {
    "AU": {
      "price": 18.6,
      "detail": "Bunnings Philips A60 B22 LED, 910lm warm white, 8W, TWO-PACK; advertised price",
      "source": "https://www.bunnings.com.au/philips-a60-b22-led-910lm-warm-white-8w-globe-2-pack_p0122033"
    },
    "UK": {
      "price": 4,
      "detail": "IKEA SOLHETTA E27 LED, 806lm, 4000K opal white, TWO-PACK, 00591516; listed price",
      "source": "https://www.ikea.com/gb/en/p/solhetta-led-bulb-e27-806-lumen-globe-opal-white-00591516/"
    },
    "CA": {
      "price": 6.99,
      "detail": "IKEA SOLHETTA E26 LED, 800lm, dimmable opal white, TWO-PACK, 30583925; listed price",
      "source": "https://www.ikea.com/ca/en/p/solhetta-led-bulb-e26-800-lumen-dimmable-globe-opal-white-30583925/"
    },
    "US": {
      "price": 4.99,
      "detail": "IKEA SOLHETTA E26 LED, 800lm dimmable opal, TWO-PACK, 60583943; listed price",
      "source": "https://www.ikea.com/us/en/p/solhetta-led-bulb-e26-800-lumen-dimmable-globe-opal-60583943/"
    }
  },
  "Big Mac": {
    "AU": {
      "price": 8.5,
      "detail": "McDonald's single Big Mac; The Economist Big Mac Index national reference, July 2026 (not a particular branch quote)",
      "source": "https://github.com/TheEconomist/big-mac-data/blob/master/output-data/big-mac-full-index.csv"
    },
    "US": {
      "price": 6.22,
      "detail": "McDonald's single Big Mac; The Economist Big Mac Index national reference, July 2026 (not a particular branch quote)",
      "source": "https://github.com/TheEconomist/big-mac-data/blob/master/output-data/big-mac-full-index.csv"
    },
    "UK": {
      "price": 5.49,
      "detail": "McDonald's single Big Mac; The Economist Big Mac Index national reference, July 2026 (not a particular branch quote)",
      "source": "https://github.com/TheEconomist/big-mac-data/blob/master/output-data/big-mac-full-index.csv"
    },
    "CA": {
      "price": 8.17,
      "detail": "McDonald's single Big Mac; The Economist Big Mac Index national reference, July 2026 (not a particular branch quote)",
      "source": "https://github.com/TheEconomist/big-mac-data/blob/master/output-data/big-mac-full-index.csv"
    }
  },
  "Umbrella": {
    "AU": {
      "price": 19.99,
      "detail": "BIG W marketplace Sandro Compact Umbrella, black; delivery excluded",
      "source": "https://www.bigw.com.au/product/sandro-compact-umbrella-black/p/9904315629"
    },
    "UK": {
      "price": 10,
      "detail": "Boots Totes Slim Round Compact Umbrella, plain black, 10280584; advertised price",
      "source": "https://www.boots.com/totes-slim-round-black-10280584"
    },
    "CA": {
      "price": 14.97,
      "detail": "Walmart Air Canada Micro Compact Travel Umbrella, UPF50, black; online price",
      "source": "https://www.walmart.ca/en/ip/Air-Canada-Micro-Compact-Travel-Umbrella-with-UPF-50-Sun-Protection-Black-One-Size/6S8ZZFXL6RDW"
    },
    "US": {
      "price": 9.99,
      "detail": "Target Totes Super Mini Manual ECO Compact Umbrella, black; advertised price before tax",
      "source": "https://www.target.com/s/totes%2Bcompact%2Bumbrellas"
    }
  },
  "Cinema ticket": {
    "AU": {
      "price": 27.5,
      "detail": "Ritz Cinemas Randwick, regular non-member adult ticket at box office; standard session, online fee excluded",
      "source": "https://www.ritzcinemas.com.au/ticket-prices"
    },
    "US": {
      "price": 13,
      "detail": "The Grand Cinema, Tacoma WA; regular adult ticket, before separately added tax if applicable",
      "source": "https://grandcinema.com/all-about-the-grand/"
    },
    "UK": {
      "price": 14.5,
      "detail": "Prince Charles Cinema, London; non-member evening/weekend standard single performance, box office; online booking fee excluded",
      "source": "https://princecharlescinema.com/faq/"
    },
    "CA": {
      "price": 14.5,
      "detail": "Princess Cinemas, Waterloo ON; regular non-member admission at box office, no special event",
      "source": "https://princesscinemas.com/princess-cinemas-ticket-prices"
    }
  },
  "Movie popcorn": {
    "US": {
      "price": 9,
      "detail": "The Grand Cinema, Tacoma WA; large popcorn at concession counter",
      "source": "https://grandcinema.com/all-about-the-grand/"
    },
    "UK": {
      "price": 3.9,
      "detail": "Prince Charles Cinema, London; large popcorn, published 2026 bar menu",
      "source": "https://princecharlescinema.com/wp-content/uploads/2026/03/BAR-PRICE-LIST_2026.pdf"
    },
    "CA": {
      "price": 9.75,
      "detail": "Cineplex Cinemas Coquitlam and VIP, BC; large popcorn, advertised concession price before tax",
      "source": "https://www.cineplex.com/snacks/theatre/1412/menu"
    },
    "AU": {
      "price": 7,
      "detail": "Tivoli West Wyalong NSW candy bar; large popcorn, regular menu serving",
      "source": "https://www.tivoliwestwyalong.com.au/candy-bar"
    }
  },
  "Movie ticket popcorn combo": {
    "US": {
      "price": 19,
      "detail": "The Grand Cinema, Tacoma WA; one regular adult ticket plus one small popcorn, separately priced; tax excluded",
      "source": "https://grandcinema.com/all-about-the-grand/"
    },
    "AU": {
      "price": 40,
      "detail": "Event Cinemas Adult Combo ePackage: one Original adult ticket, small popcorn, small drink and choc top; standard-format restrictions apply",
      "source": "https://giftshop.eventcinemas.com.au/products/AdultCombo"
    },
    "UK": {
      "price": 17.4,
      "detail": "Prince Charles Cinema, London; one non-member evening standard ticket plus one small popcorn, separately priced; online booking fee excluded",
      "source": "https://princecharlescinema.com/faq/",
      "supportingSources": [
        "https://princecharlescinema.com/wp-content/uploads/2026/03/BAR-PRICE-LIST_2026.pdf"
      ]
    },
    "CA": {
      "price": 19.5,
      "detail": "Valley Drive In, Cambridge NS; one Single admission plus small popcorn, separately priced; advertised gate ticket includes tax, no online fee",
      "source": "https://www.valleydrivein.com/",
      "supportingSources": [
        "https://www.valleydrivein.com/canteen"
      ]
    }
  },
  "Petrol per litre": {
    "US": {
      "price": 1.13,
      "detail": "AAA national regular gasoline average, 21 Oct 2026; PER LITRE, converted from US gallons and rounded to cents",
      "source": "https://gasprices.aaa.com/?state=US"
    },
    "CA": {
      "price": 1.71,
      "detail": "CAA national regular gasoline average, 22 Oct 2026; one litre, rounded to cents",
      "source": "https://www.caa.ca/gas-prices/"
    },
    "AU": {
      "price": 2.42,
      "detail": "AIP Australian national average retail unleaded petrol, week ending 18 Oct 2026; one litre, rounded to cents",
      "source": "https://aip.com.au/wp-content/uploads/2026/10/Weekly-Petrol-Prices-Report-18-October-2026.pdf"
    },
    "UK": {
      "price": 1.75,
      "detail": "Fuel Crisis England dashboard of DESNZ UK national weekly unleaded pump average, week of 19 Oct 2026; one litre rounded to pence",
      "source": "https://www.fuelcrisisengland.co.uk/fuel-prices"
    }
  },
  "Parking": {
    "AU": {
      "price": 16,
      "detail": "Wilson Parking The Domain, Sydney; weekday drive-up car parking, first hour from 6am; no event tariff",
      "source": "https://www.wilsonparking.com.au/parking-locations/new-south-wales/sydney-cbd/the-domain-car-park/"
    },
    "CA": {
      "price": 5,
      "detail": "Green P Carpark 404, 95 Beecroft Road Toronto; one hour at the published half-hour rate, regular tariff",
      "source": "https://parking.greenp.com/carpark/404_95-beecroft-road/"
    },
    "US": {
      "price": 5.5,
      "detail": "NYC DOT Zone M1, Midtown Core/Lower Manhattan; first hour at an All Vehicles meter during paid hours, not commercial-only meter",
      "source": "https://www.nyc.gov/html/dot/html/motorist/parking-rates.shtml"
    },
    "UK": {
      "price": 5.68,
      "detail": "Lambeth Brixton Popes Road car park; Band A non-diesel vehicle, one off-peak hour (before 10am or after 1pm), published 2026/27 tariff; app extras excluded",
      "source": "https://www.lambeth.gov.uk/parking/emission-based-parking-charges/street-car-park-charges"
    }
  },
  "Tennis balls": {
    "UK": {
      "price": 3.49,
      "detail": "Decathlon TB160 pressureless yellow tennis balls, 3-pack, ID 8600512; shipping excluded",
      "source": "https://www.decathlon.co.uk/p/tennis-ball-tri-pack-yellow-tb160/327414/m8600512"
    },
    "AU": {
      "price": 8,
      "detail": "BIG W Wilson Grand Slam tennis balls, 3-pack; advertised price",
      "source": "https://www.bigw.com.au/sports-leisure/sports-equipment/tennis-gear/tennis-balls/c/6710109100"
    },
    "US": {
      "price": 5.99,
      "detail": "Walmart Penn Championship Extra Duty tennis balls, one can of 3; listed regular price before rollback, tax excluded",
      "source": "https://www.wal-mart.com/ip/Penn-Championship-Extra-Duty-Tennis-Balls-1-Can-3-balls/9906177"
    },
    "CA": {
      "price": 12.51,
      "detail": "Walmart Canada marketplace Wilson T1003 Championship regular-duty tennis balls, 3-pack; advertised price before tax and shipping",
      "source": "https://www.walmart.ca/en/ip/Wilson-Tennis-Balls-T1003-Championship-Tennis-Ball-3-Pack/6MJI6E9SD1D5"
    }
  },
  "McDonald's fries": {
    "UK": {
      "price": 1.99,
      "detail": "McDonald's, 2 Trafalgar Way London; Medium Fries, app pickup menu checked by Drive Thru Index on 14 Oct 2026",
      "source": "https://drivethruindex.com/restaurants/uk/eng/london/mcdonalds-e145sp-2-trafalgar-way"
    },
    "CA": {
      "price": 4.29,
      "detail": "McDonald’s Toronto, medium World Famous Fries; CostDB published October 2026 Toronto menu reference, before tax; branch prices vary",
      "source": "https://costdb.com/store/mcdonalds"
    },
    "AU": {
      "price": 4.1,
      "detail": "McDonald’s Bankstown Centro Food Court NSW; Medium Fries, pickup menu checked 16 Oct 2026 by Drive Thru Index; no delivery markup",
      "source": "https://drivethruindex.com/restaurants/au/nsw/bankstown/mcdonalds-951195"
    },
    "US": {
      "price": 5.49,
      "detail": "McDonald’s, 160 Broadway NYC; Medium French Fries, Uber Eats delivery menu price, before tax and delivery/service fees",
      "source": "https://www.ubereats.com/store/mcdonalds-fidi-160-broadway/Cn7rm31RTym93cHeWFUSow"
    }
  },
  "Air fryer": {
    "CA": {
      "price": 99.98,
      "detail": "Walmart Gourmia 3.7L / 4qt digital air fryer, 12 functions; listed regular price before offer, tax excluded",
      "source": "https://www.walmart.ca/en/ip/Gourmia-3-7-L-4-Qt-Digital-Air-Fryer-with-12-Functions-and-Guided-Cooking/6000204881654"
    },
    "AU": {
      "price": 49,
      "detail": "Kmart Anko 4L Space Saving air fryer, AF4002; Australian CHOICE review’s listed reference price",
      "source": "https://www.choice.com.au/products/home-and-living/kitchen/benchtop-cooking/kmart-anko-4l-air-fryer-space-saving-af4002"
    },
    "UK": {
      "price": 49.99,
      "detail": "Tower Vortx Digital Air Fryer, 4.2L Black, T17147; advertised manufacturer price",
      "source": "https://www.towerhousewares.co.uk/air-fryers/vortx-42-litre-digital-air-fryer-1400w-1"
    },
    "US": {
      "price": 69.99,
      "detail": "Walmart online listing, Gourmia GAF486 4qt digital air fryer with guided cooking; selected 4qt variant, tax and shipping excluded",
      "source": "https://www.walmart.com/ip/316564798"
    }
  },
  "Robot vacuum": {
    "US": {
      "price": 479.99,
      "detail": "Target eufy C10 self-emptying robot vacuum; listed regular price before sale, tax excluded",
      "source": "https://www.target.com/p/-/A-1008579832"
    },
    "AU": {
      "price": 249.95,
      "detail": "BIG W marketplace MyGenie Laser Sonic AI Robot Vacuum & Mop; advertised price, delivery excluded",
      "source": "https://www.bigw.com.au/product/mygenie-laser-sonic-ai-robot-vacuum-mop-smart-mapping-hepa-wet-dry/p/9901024562"
    },
    "CA": {
      "price": 999.99,
      "detail": "Canadian Tire Roborock QR798 robot vacuum and mop, self-empty, white, 043-7632-2; listed regular price before sale, tax excluded",
      "source": "https://www.canadiantire.ca/en/cat/home/appliances/vacuum-cleaners/robot-vacuums-DC0000678.html"
    },
    "UK": {
      "price": 499,
      "detail": "eufy UK Omni C20 Robot Vacuum with All-in-One Station; advertised manufacturer price",
      "source": "https://www.eufy.com/uk/products/t2292211"
    }
  },
  "Chicken breast": {
    "CA": {
      "price": 31.94,
      "detail": "Metro Maple Leaf Prime boneless skinless chicken breast, raised without antibiotics; PER 1KG, not price of an average tray",
      "source": "https://www.metro.ca/en/online-grocery/aisles/meat-poultry/chicken-turkey/breasts/boneless-chicken-breast/p/234383"
    },
    "UK": {
      "price": 6.9,
      "detail": "Tesco British Chicken Breast Fillets, 1kg pack; regular online price",
      "source": "https://www.tesco.com/shop/en-GB/search?query=tesco+chicken+breast+fillet+1kg"
    },
    "AU": {
      "price": 11,
      "detail": "Coles RSPCA Approved Chicken Breast Fillets Large Pack, approx. 1.4kg; PER 1KG unit price, not total tray price",
      "source": "https://www.coles.com.au/browse/meat-seafood/poultry/breast-fillets"
    },
    "US": {
      "price": 8.84,
      "detail": "Walmart Perdue Harvestland Perfect Portions fresh boneless skinless chicken breast; 1.65 lb pack, not a per-kg price; tax excluded",
      "source": "https://www.walmart.com/browse/food/chicken-breasts/976759_9569500_1001443_8161643"
    }
  },
  "Fish and chips": {
    "US": {
      "price": 22,
      "detail": "Loreley Beer Garden, Lower East Side NYC; lightly battered fresh cod with French fries, main menu price before tax and tip",
      "source": "https://www.loreleynyc.com/menu/fish-chips"
    },
    "AU": {
      "price": 13,
      "detail": "Old English Fish ’N’ Chips, Forestville NSW; regular Fish & Chips pack, no crumbed upgrade; Good Friday special menu excluded",
      "source": "https://oldenglishfishnchips.com.au/menu/"
    },
    "UK": {
      "price": 21.99,
      "detail": "Poppies London main menu; regular cod meal with chips and homemade tartare sauce; optional service charge excluded",
      "source": "https://poppiesfishandchips.co.uk/menu/"
    },
    "CA": {
      "price": 18,
      "detail": "Len Duckworth Toronto take-out menu; one haddock plus one Fresh Cut Chips side, separately priced; tax excluded",
      "source": "https://lenduckworthfishandchips.ca/"
    }
  },
  "Domino's pizza": {
    "US": {
      "price": 13.99,
      "detail": "Domino’s, 45 Catherine Street NYC; Large 14-inch Hand Tossed Pizza, app pickup menu checked 22 Oct 2026 by Drive Thru Index; tax excluded",
      "source": "https://drivethruindex.com/restaurants/us/ny/new-york/dominos-3695"
    },
    "UK": {
      "price": 22.99,
      "detail": "Domino’s, 194 Kentish Town Road London; Original Cheese & Tomato Large 13.5-inch, app pickup menu checked 21 Oct 2026 by Drive Thru Index",
      "source": "https://drivethruindex.com/restaurants/uk/eng/london/dominos-29011"
    },
    "AU": {
      "price": 6,
      "detail": "Domino’s Australia advertised STARTING offer: one Large Value Range pizza for pickup at participating stores, voucher as advertised; upgrades excluded",
      "source": "https://www.dominos.com.au/menu/"
    },
    "CA": {
      "price": 12.99,
      "detail": "Domino’s Canada advertised Large 2-Topping Pizza offer; pickup at participating stores, per pizza, no upgrades; tax excluded",
      "source": "https://www.dominos.ca/"
    }
  },
  "Footlong sub sandwich": {
    "US": {
      "price": 10.49,
      "detail": "Subway Midtown West (7th Ave), NYC; Veggie Delite Footlong, Uber Eats menu price, tax and delivery/service fees excluded",
      "source": "https://www.ubereats.com/store/subway-midtown-west-7th-ave/h5NbdPP4RPKuEDa8OFpX8Q"
    },
    "CA": {
      "price": 8.59,
      "detail": "Subway Canada online store 24923-0; Veggie Delite Footlong, default bread and toppings, no add-ons; tax excluded",
      "source": "https://www.subway.com/en-ca/restaurant/24923-0/customizer/productsummary/1016/category/sandwiches"
    },
    "AU": {
      "price": 8,
      "detail": "Subway Beverly Hills NSW 2209, Sydney; Meatball Footlong as listed in MenuWeb’s published branch-menu reference; no upgrades/delivery",
      "source": "https://apac-cdn.menuweb.menu/storage/media/companies_menu_pdf/114450616/subway-sydney-menu.pdf"
    },
    "UK": {
      "price": 8,
      "detail": "Subway, 2 Market Street Wolverhampton; Veggie Delite Footlong as listed in MenuWeb’s published branch-menu reference; no upgrades/delivery",
      "source": "https://weur-cdn.menuweb.menu/storage/media/companies_menu_pdf/114749712/subway-birmingham-menu.pdf"
    }
  },
  "Pint of beer": {
    "AU": {
      "price": 13,
      "detail": "Taphouse Sydney, Hawke’s Lager 4.2% draught; one Australian pint (570mL), regular menu price, public-holiday surcharge excluded",
      "source": "https://taphousesydney.com.au/menu/"
    },
    "UK": {
      "price": 6,
      "detail": "Southgate Masonic Centre bar, London; Regular Lager, one imperial pint (568mL), published January 2026 bar menu",
      "source": "https://www.southgatemasoniccentre.co.uk/menus"
    },
    "CA": {
      "price": 5.99,
      "detail": "Round Table Tavern, Toronto; Molson Canadian draught, one menu pint (20oz); tax and tip excluded",
      "source": "https://roundtabletavern.ca/menu/"
    },
    "US": {
      "price": 10,
      "detail": "The Elgin, Midtown West NYC; Elgin Lager, standard draft-list serving; tax and tip excluded",
      "source": "https://www.elginnyc.com/menu/beer-list-1/"
    }
  },
  "Starbucks latte": {
    "AU": {
      "price": 6.8,
      "detail": "Starbucks George Street, Sydney; hot Latte, Uber Eats base listed serving with regular milk, no size upgrade/add-ons; delivery/service fees excluded",
      "source": "https://www.ubereats.com/au/store/starbucks-george-street/BA2vIaHpWdmkWkkNwzTjvw"
    },
    "US": {
      "price": 6.65,
      "detail": "Starbucks NYC DoorDash store 34312444; hot Caffè Latte base listed serving, no size upgrade/add-ons; tax, delivery/service fees excluded",
      "source": "https://www.doordash.com/en/store/starbucks-new-york-34312444/"
    },
    "UK": {
      "price": 5.1,
      "detail": "Starbucks Victoria Street, London; hot Caffè Latte, Deliveroo base listed serving, no size upgrade/add-ons; delivery/service fees excluded",
      "source": "https://deliveroo.co.uk/menu/london/westminster/12061-starbucks-victoria-street-27"
    },
    "CA": {
      "price": 5.65,
      "detail": "Starbucks 203 College Street, Toronto; hot Caffè Latte, Uber Eats base listed serving, no size upgrade/add-ons; tax, delivery/service fees excluded",
      "source": "https://www.ubereats.com/ca/store/starbucks-203-college-street/MgB4zgKSVt2lhcZlRnrMww"
    }
  },
  "Uber short ride": {
    "AU": {
      "price": 29,
      "detail": "Uber’s published Sydney average for a 16-minute ride; city reference average, not a fixed route, 5km fare or live quote",
      "source": "https://www.uber.com/au/en/r/cities/taxi/sydney-nsw-au/"
    },
    "US": {
      "price": 31,
      "detail": "Uber’s published NYC average for a 19-minute ride; city reference average, not a fixed route, 5km fare or live quote",
      "source": "https://www.uber.com/us/en/r/cities/taxi/new-york-city-new-york-city-us/"
    },
    "UK": {
      "price": 20,
      "detail": "Uber London published average UberX fare to Paddington Train Station; starting points vary, not a fixed 5km fare or live quote",
      "source": "https://www.uber.com/global/en/r/cities/london-eng-gb/"
    },
    "CA": {
      "price": 15,
      "detail": "Uber Toronto published average UberX fare to CF Toronto Eaton Centre; starting points vary, not a fixed 5km fare or live quote",
      "source": "https://www.uber.com/global/en/r/cities/toronto-on-ca/"
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
   (out.priceEvidence||={})[region]={checkedAt,source:e.source,...(e.supportingSources?{supportingSources:e.supportingSources}: {})};
  }
  if(item.name==='Pint of beer')out.displayName='Beer';
  if(item.name==='Uber short ride')out.displayName='Uber ride';
  if(item.name==='Band-Aids box')out.displayName='Adhesive plasters';
  return out;
 }
 function daily(originals,saved,day){
  if(saved)return validItems(saved.items)?clone(saved.items):clone(originals);
  return originals.map(item=>current(item,day));
 }
 function label(item){if(text(item.displayName)&&item.displayName)return item.displayName;return item.name==='Pint of beer'&&item.detail.includes('500ml')?'Beer (500ml)':item.name;}
 function detail(item,region){return text(item.priceDetails?.[region])?item.priceDetails[region]:item.detail;}
 function evidence(item,region){
  const e=item.priceEvidence?.[region];
  if(!e||!/^\d{4}-\d{2}-\d{2}$/.test(e.checkedAt)||typeof e.source!=='string'||!/^https:\/\/[^\s]+$/.test(e.source))return null;
  const supportingSources=Array.isArray(e.supportingSources)?e.supportingSources.filter(url=>typeof url==='string'&&/^https:\/\/[^\s]+$/.test(url)).slice(0,4):[];
  return {checkedAt:e.checkedAt,source:e.source,...(supportingSources.length?{supportingSources}:{})};
 }
 root.BREAK_ROOM_LOWBALL_PRICES=Object.freeze({effectiveDay,checkedAt,current,daily,validItems,label,detail,evidence});
})(typeof window!=='undefined'?window:globalThis);
