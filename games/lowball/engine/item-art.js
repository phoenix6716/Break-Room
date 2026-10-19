/* Generated PNG artwork only. Source atlases and extraction manifest are in icons/generated/.
   Add a generated image and its explicit item mapping when extending the item pool. */
(() => {
  'use strict';
  const items = Object.freeze({
  "Big Mac": "big-mac.png",
  "Netflix Standard": "netflix-standard.png",
  "Spotify Premium": "spotify-premium.png",
  "iPhone 16": "iphone-16.png",
  "Coca-Cola bottle": "coca-cola-bottle.png",
  "Dozen eggs": "dozen-eggs.png",
  "Cinema ticket": "cinema-ticket.png",
  "PlayStation 5": "playstation-5.png",
  "McDonald's fries": "mcdonalds-fries.png",
  "Loaf of bread": "loaf-of-bread.png",
  "Litre of milk": "litre-of-milk.png",
  "Starbucks latte": "starbucks-latte.png",
  "Movie popcorn": "movie-popcorn.png",
  "AirPods Pro 3": "airpods-pro-3.png",
  "Nintendo Switch 2": "nintendo-switch-2.png",
  "Domino's pizza": "dominos-pizza.png",
  "Petrol per litre": "petrol-per-litre.png",
  "Gym membership": "gym-membership.png",
  "Avocado": "avocado.png",
  "Uber short ride": "uber-short-ride.png",
  "Toothpaste tube": "toothpaste-tube.png",
  "Band-Aids box": "band-aids-box.png",
  "Kindle Paperwhite": "kindle-paperwhite.png",
  "Standard stamp": "standard-stamp.png",
  "Movie ticket popcorn combo": "movie-ticket-popcorn-combo.png",
  "Levi's 501 jeans": "levis-501-jeans.png",
  "Dog food bag": "dog-food-bag.png",
  "Haircut": "haircut.png",
  "Umbrella": "umbrella.png",
  "Coffee capsules box": "coffee-capsules-box.png",
  "Monopoly board game": "monopoly-board-game.png",
  "Sunscreen bottle": "sunscreen-bottle.png",
  "Bananas": "bananas.png",
  "Cheddar cheese block": "cheddar-cheese-block.png",
  "Butter": "butter.png",
  "Chicken breast": "chicken-breast.png",
  "Minced beef": "minced-beef.png",
  "Rice": "rice.png",
  "Pasta": "pasta.png",
  "Peanut butter": "peanut-butter.png",
  "Breakfast cereal": "breakfast-cereal.png",
  "Chocolate block": "chocolate-block.png",
  "Potato chips": "potato-chips.png",
  "Orange juice": "orange-juice.png",
  "Bottled water": "bottled-water.png",
  "Tea bags": "tea-bags.png",
  "Ice cream tub": "ice-cream-tub.png",
  "Pint of beer": "pint-of-beer.png",
  "Bottle of wine": "bottle-of-wine.png",
  "Six-pack of beer": "six-pack-of-beer.png",
  "Flat white": "flat-white.png",
  "Footlong sub sandwich": "footlong-sub-sandwich.png",
  "Frozen pizza": "frozen-pizza.png",
  "Fish and chips": "fish-and-chips.png",
  "Energy drink": "energy-drink.png",
  "Toilet paper": "toilet-paper.png",
  "Dishwashing liquid": "dishwashing-liquid.png",
  "Laundry detergent": "laundry-detergent.png",
  "Tissues": "tissues.png",
  "AA batteries": "aa-batteries.png",
  "LED light bulb": "led-light-bulb.png",
  "Shampoo": "shampoo.png",
  "Deodorant": "deodorant.png",
  "Razor refills": "razor-refills.png",
  "Toothbrush": "toothbrush.png",
  "Lip balm": "lip-balm.png",
  "Hand soap": "hand-soap.png",
  "Cotton t-shirt": "cotton-t-shirt.png",
  "Socks": "socks.png",
  "Hoodie": "hoodie.png",
  "Nike Air Force 1": "nike-air-force-1.png",
  "Sunglasses": "sunglasses.png",
  "Backpack": "backpack.png",
  "Wireless mouse": "wireless-mouse.png",
  "USB-C cable": "usb-c-cable.png",
  "Phone case": "phone-case.png",
  "Bluetooth speaker": "bluetooth-speaker.png",
  "iPad": "ipad.png",
  "Apple Watch SE": "apple-watch-se.png",
  "External SSD": "external-ssd.png",
  "Air fryer": "air-fryer.png",
  "Electric kettle": "electric-kettle.png",
  "Toaster": "toaster.png",
  "Robot vacuum": "robot-vacuum.png",
  "Pillow": "pillow.png",
  "Pedestal fan": "pedestal-fan.png",
  "Disney+": "disney.png",
  "Paperback novel": "paperback-novel.png",
  "Zoo ticket": "zoo-ticket.png",
  "Public transport fare": "public-transport-fare.png",
  "Car wash": "car-wash.png",
  "Dry cleaning": "dry-cleaning.png",
  "Parking": "parking.png",
  "PS5 game": "ps5-game.png",
  "LEGO set": "lego-set.png",
  "Jigsaw puzzle": "jigsaw-puzzle.png",
  "Soccer ball": "soccer-ball.png",
  "Yoga mat": "yoga-mat.png",
  "Tennis balls": "tennis-balls.png",
  "Cat food": "cat-food.png"
});
  const utilities = Object.freeze({
  "trophy": "trophy.png",
  "lock": "lock.png",
  "stats": "stats.png",
  "gem-green": "gem-green.png",
  "gem-yellow": "gem-yellow.png",
  "gem-orange": "gem-orange.png",
  "gem-red": "gem-red.png",
  "sound-on": "sound-on.png",
  "sound-off": "sound-off.png"
});
  function source(item) {
    const name = typeof item === 'string' ? item : item?.name;
    const utility = typeof item === 'object' ? item?.art : item;
    const file = items[name] || utilities[utility];
    if (!file) throw new RangeError('Missing Lowball image: ' + (name || utility));
    return 'icons/generated/' + file;
  }
  function markup(item) {
    return '<img class="lowball-art" src="' + source(item) + '" alt="" width="192" height="192" decoding="async" draggable="false">';
  }
  function gem(score, index) {
    const colour = score >= 95 ? 'green' : score >= 80 ? 'yellow' : score >= 50 ? 'orange' : 'red';
    return '<img class="gem" src="' + source('gem-' + colour) + '" style="--i:' + index + '" alt="" width="28" height="28" draggable="false">';
  }
  window.LOWBALL_ART = Object.freeze({source, markup, gem, items, utilities});
})();
