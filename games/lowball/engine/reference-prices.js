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
