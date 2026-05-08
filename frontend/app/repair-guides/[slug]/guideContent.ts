export type Section =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string }
  | { type: "tip"; title: string; text: string; color?: string }
  | { type: "warning"; title: string; text: string }
  | { type: "steps"; items: { title: string; text: string }[] }
  | { type: "list"; items: string[] };

export type GuideContent = {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  image: string;
  readTime: string;
  author: string;
  sections: Section[];
  relatedSlugs: string[];
};

export const allGuides: Record<string, GuideContent> = {

  "what-to-do-water-damage": {
    slug: "what-to-do-water-damage",
    category: "General",
    title: "What to Do Immediately After Water Damage",
    excerpt: "Dropped your phone in water? The next 60 seconds are critical. Follow these steps to give your device the best chance of survival before bringing it in.",
    image: "https://images.unsplash.com/photo-1563203369-26f2e4a5ccf7?auto=format&fit=crop&w=1400&q=80",
    readTime: "4 min read",
    author: "Jesup Tech Team",
    sections: [
      {
        type: "paragraph",
        text: "Water and electronics are a devastating combination — but acting quickly and correctly in the first few minutes can be the difference between a full recovery and a total loss. Whether your phone slipped into the sink, fell in a puddle, or took a swim in the toilet, here's exactly what to do.",
      },
      {
        type: "warning",
        title: "Do NOT charge it",
        text: "This is the single biggest mistake people make. Plugging in a water-damaged phone can short-circuit the entire board instantly. Keep it unplugged until a technician has inspected it.",
      },
      {
        type: "heading",
        text: "Step-by-step: the first 10 minutes",
      },
      {
        type: "steps",
        items: [
          { title: "Get it out of the water immediately", text: "Every second counts. The longer it's submerged, the deeper water gets into the device. Grab it out as fast as possible." },
          { title: "Power it off right away", text: "If it's still on, hold the power button and shut it down. Water + electricity = permanent damage. Don't wait to see if it's 'still working.'" },
          { title: "Remove the case, SIM tray, and any accessories", text: "This allows air to circulate around the device and lets any trapped water escape faster." },
          { title: "Gently shake out excess water", text: "Hold the phone with ports facing down and gently shake it to dislodge water from the openings. Don't shake vigorously — that can push water deeper." },
          { title: "Pat dry with a soft cloth", text: "Use a lint-free cloth or paper towel to absorb moisture from the exterior, screen, and port openings. Be gentle — don't press water further in." },
          { title: "Do NOT use a hair dryer or oven", text: "Heat damages the adhesive, warps the screen, and can melt internal components. Let it air-dry at room temperature only." },
          { title: "Bring it to Jesup within 24 hours", text: "Our technicians use professional drying equipment and corrosion inhibitors that dramatically improve recovery rates. The sooner the better." },
        ],
      },
      {
        type: "heading",
        text: "What about the rice trick?",
      },
      {
        type: "paragraph",
        text: "You've probably heard 'put it in a bag of rice.' This is a myth that wastes critical time. Rice barely absorbs moisture from electronics and can leave starch dust inside your device. Silica gel packets are marginally better, but neither compares to professional drying equipment. Bring it to us — don't waste 48 hours in a bowl of rice.",
      },
      {
        type: "heading",
        text: "Signs your phone has water damage",
      },
      {
        type: "list",
        items: [
          "Screen flickering, dimming, or showing spots",
          "Distorted or muffled audio from speakers",
          "Camera lens fogged or blurry",
          "Charging port not recognising cables",
          "Phone randomly restarting or shutting off",
          "Liquid Contact Indicator (LCI) turned pink or red (inside SIM tray slot)",
        ],
      },
      {
        type: "tip",
        title: "Act within 24 hours for the best results",
        text: "Water damage recoveries are significantly more successful when treated within the first 24 hours. After 48 hours, corrosion sets in on the logic board and recovery becomes much harder — and more expensive.",
        color: "primary",
      },
    ],
    relatedSlugs: ["iphone-battery-replacement", "protect-phone-screen", "cracked-screen-repair-vs-replace"],
  },

  "iphone-battery-replacement": {
    slug: "iphone-battery-replacement",
    category: "iPhone",
    title: "How to Tell If Your iPhone Battery Needs Replacing",
    excerpt: "Is your iPhone dying faster than it used to? Here are the clear signs your battery is on its way out — and when a replacement makes sense.",
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1400&q=80",
    readTime: "3 min read",
    author: "Jesup Tech Team",
    sections: [
      {
        type: "paragraph",
        text: "iPhone batteries are lithium-ion, which means they have a limited number of charge cycles before their capacity starts to degrade. Apple considers a battery 'consumed' at 80% of its original capacity. But most users notice problems long before their phone tells them anything is wrong.",
      },
      {
        type: "heading",
        text: "How to check your battery health",
      },
      {
        type: "steps",
        items: [
          { title: "Open Settings", text: "Go to Settings > Battery > Battery Health & Charging." },
          { title: "Check Maximum Capacity", text: "This shows what percentage of the original capacity your battery still holds. 100% is new. Below 80% means the battery is degraded." },
          { title: "Look for 'Peak Performance Capability'", text: "If Apple is throttling your phone's performance to prevent unexpected shutdowns, it will say so here. This is a sure sign you need a replacement." },
        ],
      },
      {
        type: "heading",
        text: "Signs you need a new battery (even without checking Settings)",
      },
      {
        type: "list",
        items: [
          "Phone dies at 20–30% battery remaining",
          "Battery drains within a few hours even with light use",
          "iPhone randomly shuts off and restarts",
          "Phone gets unusually hot during normal use",
          "Apps slow down or lag even on a newer model",
          "Battery percentage jumps around erratically",
          "Back of phone appears slightly bulged or swollen",
        ],
      },
      {
        type: "warning",
        title: "Swollen battery = urgent",
        text: "If your iPhone feels thicker than usual, or the screen is slightly lifting away from the frame, the battery may be swollen. This is a safety hazard. Stop using the phone immediately and bring it in.",
      },
      {
        type: "heading",
        text: "Is a battery replacement worth it?",
      },
      {
        type: "paragraph",
        text: "Almost always yes. A battery replacement is one of the most cost-effective repairs you can make. It brings your phone back to full performance, stops unexpected shutdowns, and extends the life of your device by 1–3 years. Compare that to the cost of a new iPhone — the math is obvious.",
      },
      {
        type: "tip",
        title: "Most iPhone battery replacements take under an hour",
        text: "Walk into any Jesup location and we'll check your battery health for free. If a replacement is needed, we carry OEM-quality batteries for every iPhone model — from iPhone 6 to the latest iPhone 17.",
        color: "primary",
      },
    ],
    relatedSlugs: ["how-long-smartphone-battery-last", "what-to-do-water-damage", "cracked-screen-repair-vs-replace"],
  },

  "cracked-screen-repair-vs-replace": {
    slug: "cracked-screen-repair-vs-replace",
    category: "Phone",
    title: "Cracked Screen: Repair or Replace — What's Actually Worth It?",
    excerpt: "Not every cracked screen means it's time to buy a new phone. We break down exactly when repair is the smarter and cheaper choice.",
    image: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?auto=format&fit=crop&w=1400&q=80",
    readTime: "5 min read",
    author: "Jesup Tech Team",
    sections: [
      {
        type: "paragraph",
        text: "A cracked screen is one of the most common phone problems we see — and one of the most misunderstood. Many people assume a cracked phone means it's time to upgrade. In most cases, that's just not true. Here's a practical breakdown of when to repair vs. when to replace.",
      },
      {
        type: "heading",
        text: "First: assess the damage",
      },
      {
        type: "list",
        items: [
          "Is the display still working (colours, touch, brightness)?",
          "Is the crack limited to the outer glass, or is the display underneath damaged?",
          "Are there black spots, dead zones, or lines on the screen?",
          "Is the phone otherwise in good condition (battery, cameras, etc.)?",
        ],
      },
      {
        type: "heading",
        text: "When repair is the right call",
      },
      {
        type: "paragraph",
        text: "Screen repair makes sense in the vast majority of cases — especially if your phone is less than 3 years old and otherwise working well. A quality screen replacement restores full functionality: touch sensitivity, True Tone, Face ID, and display brightness — everything back to normal.",
      },
      {
        type: "steps",
        items: [
          { title: "Phone is under 3 years old", text: "Repair is almost always worth it. You have many more useful years ahead." },
          { title: "Only the outer glass is cracked", text: "This is typically the cheapest repair — the OLED panel underneath is fine." },
          { title: "Display still works properly", text: "If colours, brightness, and touch all work, a simple glass replacement may be all you need." },
          { title: "The rest of the phone is in good shape", text: "Good battery, working cameras, no other major issues — repair and keep going." },
        ],
      },
      {
        type: "heading",
        text: "When to consider replacing instead",
      },
      {
        type: "list",
        items: [
          "Phone is 5+ years old and showing other signs of wear",
          "The OLED display is damaged (dead pixels, black spots, lines)",
          "Repair cost is more than 60–70% of the phone's current value",
          "Multiple components are failing at once (battery + screen + camera)",
        ],
      },
      {
        type: "tip",
        title: "Don't ignore a cracked screen",
        text: "A small crack spreads quickly. Pressure from your pocket, repeated drops, or even temperature changes can cause it to shatter further. Every day you wait, the repair bill can get bigger.",
        color: "primary",
      },
      {
        type: "paragraph",
        text: "At Jesup, we offer free diagnostics — so you'll know the exact repair cost before committing to anything. We use OEM-quality parts and back every screen replacement with a 1-year limited warranty.",
      },
    ],
    relatedSlugs: ["protect-phone-screen", "iphone-battery-replacement", "what-to-do-water-damage"],
  },

  "laptop-battery-dying-signs": {
    slug: "laptop-battery-dying-signs",
    category: "Computer",
    title: "5 Signs Your Laptop Battery Is Dying (And What To Do)",
    excerpt: "Laptop not holding a charge like it used to? These warning signs tell you when it's time for a battery swap before it leaves you stranded.",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1400&q=80",
    readTime: "4 min read",
    author: "Jesup Tech Team",
    sections: [
      {
        type: "paragraph",
        text: "Laptop batteries are built to last 300–500 charge cycles before noticeable degradation. For most people, that's 2–4 years of daily use. The tricky part? A dying battery rarely announces itself — it just quietly gets worse until you're permanently tethered to an outlet.",
      },
      {
        type: "heading",
        text: "The 5 signs your battery is failing",
      },
      {
        type: "steps",
        items: [
          { title: "Battery drains dramatically faster than before", text: "If your laptop used to last 8 hours and now barely makes it through 2, that's a degraded battery — not a software problem. Capacity has genuinely dropped." },
          { title: "Laptop shuts off unexpectedly at 15–30%", text: "Healthy batteries give you accurate readings. When the battery can't deliver the power your system needs, it cuts out — even when the meter says you still have charge remaining." },
          { title: "'Plugged in, not charging' message", text: "If your laptop shows this warning despite being connected to power, it could indicate a failing battery that the system refuses to charge further for safety reasons." },
          { title: "Battery percentage jumps or is inaccurate", text: "Going from 50% to 20% in seconds, or the indicator refusing to move — these are signs the battery's internal sensors are no longer calibrated correctly." },
          { title: "Laptop feels unusually hot near the battery", text: "A degraded battery works harder to deliver power, generating excess heat. This can warp your chassis and, in severe cases, pose a safety risk." },
        ],
      },
      {
        type: "heading",
        text: "How to check battery health on Mac and Windows",
      },
      {
        type: "list",
        items: [
          "Mac: Hold Option > Click the battery icon in the menu bar > Look for 'Condition'. Or go to System Information > Power > Cycle Count.",
          "Windows 11/10: Open Command Prompt as Admin > Type 'powercfg /batteryreport' > Open the generated HTML file to see full capacity vs. design capacity.",
          "A Mac battery is 'Replace Soon' at around 80% capacity. Windows doesn't give you a universal threshold, but under 70% is a clear sign.",
        ],
      },
      {
        type: "warning",
        title: "Never ignore a swollen laptop battery",
        text: "If your laptop lid is slightly raised, the keyboard is bubbling up, or the trackpad isn't clicking properly — your battery may be swollen. Stop using it immediately. A swollen lithium-ion battery is a fire hazard.",
      },
      {
        type: "tip",
        title: "A battery swap is fast and affordable",
        text: "Most laptop battery replacements at Jesup take 1–2 hours. We carry batteries for MacBook, Dell, HP, Lenovo, ASUS, and more. Bring it in for a free check — we'll tell you honestly whether a replacement is worth it.",
        color: "primary",
      },
    ],
    relatedSlugs: ["iphone-battery-replacement", "how-long-smartphone-battery-last", "ps5-overheating-fix"],
  },

  "ps5-overheating-fix": {
    slug: "ps5-overheating-fix",
    category: "Gaming",
    title: "PS5 Overheating? Here's Exactly What to Do",
    excerpt: "A hot PS5 is a dangerous PS5. We walk you through common overheating causes, quick fixes you can try at home, and when to bring it in for repair.",
    image: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&w=1400&q=80",
    readTime: "5 min read",
    author: "Jesup Tech Team",
    sections: [
      {
        type: "paragraph",
        text: "The PS5 is a powerful machine, and powerful machines generate heat. Sony engineered it with a large internal fan and liquid metal thermal compound to handle that heat. But if your console is shutting down mid-game, displaying overheating warnings, or sounding like a jet engine, something has gone wrong.",
      },
      {
        type: "heading",
        text: "Common signs of PS5 overheating",
      },
      {
        type: "list",
        items: [
          "Console shuts off suddenly during gameplay with no warning",
          "On-screen warning: 'Your PS5 is too hot. Turn it off and let it cool.'",
          "Fan runs at full blast all the time, even in menus",
          "Console is hot to the touch on the top or back vents",
          "Performance drops (frame rate stutters, load times longer)",
        ],
      },
      {
        type: "heading",
        text: "Fixes you can try at home",
      },
      {
        type: "steps",
        items: [
          { title: "Check your placement", text: "Your PS5 needs at least 10cm of clearance on all sides. Never place it in a cabinet, entertainment unit, or on carpet. Vertical or horizontal — both are fine, as long as airflow is clear." },
          { title: "Clean the vents with compressed air", text: "Dust buildup on the side vents is the #1 cause of PS5 overheating. Use a can of compressed air and gently blow out the vents on both sides of the console. Do this every 3–6 months." },
          { title: "Vacuum around (not inside) the vents", text: "Use a low-power vacuum on the outside of the vents to pull out dust. Never put a vacuum nozzle directly into the console." },
          { title: "Move it to a cooler room", text: "Room temperature matters. If you're gaming in a hot room without AC in summer, ambient heat compounds the problem significantly." },
          { title: "Keep it on a hard, flat surface", text: "Soft surfaces like carpet or beds block the bottom vents completely. Always use a hard, flat surface — or a dedicated PS5 stand." },
        ],
      },
      {
        type: "heading",
        text: "When home fixes won't cut it",
      },
      {
        type: "paragraph",
        text: "If you've done all of the above and your PS5 still overheats, the problem is likely internal. The two most common causes are a clogged internal fan (dust past the outer vents) or degraded thermal paste on the APU. Over time, the liquid metal Sony uses as thermal compound can dry out, migrate, or oxidise — dramatically reducing its ability to transfer heat away from the processor.",
      },
      {
        type: "warning",
        title: "Don't open it yourself unless you know what you're doing",
        text: "Replacing thermal paste on a PS5 requires removing the heatsink and working near high-voltage capacitors. Liquid metal thermal compound is also electrically conductive — if it gets on the wrong components, you can cause a short. Leave internal work to a professional.",
      },
      {
        type: "tip",
        title: "We repair PS5 overheating issues",
        text: "Jesup technicians can deep-clean the internal fan, replace the thermal paste, and test the cooling system to get your PS5 running quietly and safely again. Bring it in for a free diagnostic.",
        color: "primary",
      },
    ],
    relatedSlugs: ["laptop-battery-dying-signs", "samsung-charging-port-fix", "what-to-do-water-damage"],
  },

  "ipad-screen-cracked": {
    slug: "ipad-screen-cracked",
    category: "Tablet",
    title: "iPad Screen Cracked? Here's Everything You Need to Know",
    excerpt: "A cracked iPad screen is stressful, but it doesn't have to be expensive. We explain your repair options, costs, and what to expect at the store.",
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=1400&q=80",
    readTime: "4 min read",
    author: "Jesup Tech Team",
    sections: [
      {
        type: "paragraph",
        text: "iPads have large, beautiful displays — which unfortunately also means a larger surface area to crack. Whether it's a corner drop or a full-on shatter, here's everything you need to know about repairing a cracked iPad screen and what to expect when you bring it in.",
      },
      {
        type: "heading",
        text: "Outer glass cracked vs. display damaged — what's the difference?",
      },
      {
        type: "paragraph",
        text: "iPads have two layers: the outer glass digitizer (the layer you touch) and the LCD/OLED display panel underneath. If your screen is cracked but colours, brightness, and touch all still work normally, only the outer glass is broken. This is cheaper and faster to fix. If you see black spots, dead zones, colour bleeding, or the touch isn't responding — the display itself is damaged.",
      },
      {
        type: "heading",
        text: "Is iPad screen repair worth it?",
      },
      {
        type: "steps",
        items: [
          { title: "iPad less than 3 years old", text: "Repair is almost always the right choice. A screen replacement gives you a like-new display at a fraction of a new iPad's cost." },
          { title: "Only the outer glass is cracked", text: "This is a straightforward, affordable repair — even on iPad Pro models." },
          { title: "Display still works correctly", text: "Touch, brightness, True Tone, Apple Pencil support — if everything still functions, you just need the glass replaced." },
          { title: "Older iPad, display damaged", text: "If both the glass and the panel are damaged on an older model, get a price quote first. It might still be worth it, depending on the model." },
        ],
      },
      {
        type: "heading",
        text: "Using a cracked iPad: the risks",
      },
      {
        type: "list",
        items: [
          "Sharp glass edges can cut your fingers during use",
          "Cracks spread quickly with normal use and pocket pressure",
          "Water and dust enter through cracks and damage internal components",
          "Apple Pencil precision degrades on cracked glass",
          "If the display cracks, the repair becomes significantly more expensive",
        ],
      },
      {
        type: "warning",
        title: "Don't use tape as a temporary fix",
        text: "Putting tape over a cracked screen traps moisture and dust underneath, which can work its way to the display and connectors. It also leaves adhesive residue that complicates the repair later.",
      },
      {
        type: "tip",
        title: "We repair all iPad models — same day in most cases",
        text: "From the original iPad mini to the latest iPad Pro M4, Jesup carries quality replacement screens for every model. Walk in for a free diagnostic — we'll tell you the exact cost before any work begins.",
        color: "primary",
      },
    ],
    relatedSlugs: ["cracked-screen-repair-vs-replace", "protect-phone-screen", "iphone-battery-replacement"],
  },

  "protect-phone-screen": {
    slug: "protect-phone-screen",
    category: "General",
    title: "5 Simple Ways to Protect Your Phone Screen",
    excerpt: "Prevention is always cheaper than repair. These five habits will dramatically reduce your chances of a cracked screen — starting today.",
    image: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&w=1400&q=80",
    readTime: "3 min read",
    author: "Jesup Tech Team",
    sections: [
      {
        type: "paragraph",
        text: "Screen repairs are one of the most common fixes we do at Jesup — and the vast majority of them could have been prevented with a few simple habits. Here are five things you can do right now to protect your phone screen.",
      },
      {
        type: "steps",
        items: [
          {
            title: "Use a tempered glass screen protector",
            text: "A quality tempered glass protector absorbs impact and scratches before they reach your actual screen. If it cracks, you replace the $15 protector — not the $200 display. Look for 9H hardness rating and case-friendly edges. Jesup installs them at every location.",
          },
          {
            title: "Get a case with raised edges (bezel)",
            text: "A case that sits slightly higher than the screen gives your glass a gap from flat surfaces when you set it face-down. Slim cases with no bezel offer almost no protection in a face-down drop. Invest in a case with at least 1–2mm raised lips.",
          },
          {
            title: "Never put your phone in the same pocket as keys or coins",
            text: "Keys and metal objects are harder than Gorilla Glass. Even without a drop, keys rattling against your screen will scratch it — and scratches weaken the glass, making it more likely to crack on the next drop.",
          },
          {
            title: "Be extra careful on certain surfaces",
            text: "Concrete and tile are the worst surfaces for phone drops. The combination of hardness and unevenness creates the perfect conditions for a shattered screen. Be more mindful near these surfaces — countertops, bathroom tiles, driveways.",
          },
          {
            title: "Consider a PopSocket or phone grip",
            text: "Most drops happen because a phone slips out of your hand. A PopSocket, ring holder, or grip case gives you significantly more control. This is especially important for larger-format phones like iPhone Pro Max or Samsung Ultra models.",
          },
        ],
      },
      {
        type: "heading",
        text: "What about 'shatterproof' glass claims?",
      },
      {
        type: "paragraph",
        text: "Samsung and Apple market their latest glass as incredibly tough — Corning Gorilla Glass Victus 2, Ceramic Shield, etc. These are genuine improvements over older glass, but 'tough' doesn't mean 'unbreakable.' They still crack. A drop at the right angle on concrete will shatter any phone glass on the market today.",
      },
      {
        type: "tip",
        title: "The best screen protector is the one you actually have on",
        text: "A premium screen protector costs $15–30. A screen replacement costs $100–400 depending on your phone. The math is not complicated. Stop by any Jesup store and we'll find the right protector for your device and install it for free.",
        color: "primary",
      },
    ],
    relatedSlugs: ["cracked-screen-repair-vs-replace", "iphone-battery-replacement", "what-to-do-water-damage"],
  },

  "samsung-charging-port-fix": {
    slug: "samsung-charging-port-fix",
    category: "Samsung",
    title: "Samsung Not Charging? Try These Fixes First",
    excerpt: "Before you assume it's the charging port, there are a few quick things to try. We walk you through each one — and when a real repair is needed.",
    image: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=1400&q=80",
    readTime: "4 min read",
    author: "Jesup Tech Team",
    sections: [
      {
        type: "paragraph",
        text: "A Samsung that won't charge is instantly frustrating — but before you panic or rush to a repair shop, there are several simple things to check. Many 'charging port' issues are actually caused by something much simpler that you can fix in 2 minutes.",
      },
      {
        type: "heading",
        text: "Start with the easy checks",
      },
      {
        type: "steps",
        items: [
          {
            title: "Try a different cable",
            text: "USB-C cables degrade faster than most people think, especially at the connector end. A frayed or bent cable is the most common cause of charging issues. Try at least two different cables before assuming the port is the problem.",
          },
          {
            title: "Try a different charger/adapter",
            text: "Wall adapters can fail without any visible damage. Try your cable with a different USB-C wall adapter, a laptop's USB-C port, or a power bank. If it charges with a different source, the adapter is faulty — not your phone.",
          },
          {
            title: "Clean the charging port",
            text: "Pocket lint is a silent killer. It compacts in the USB-C port over time until the cable can't make a proper connection. Shine a torch into the port. If you see debris, use a toothpick or wooden interdental brush to gently scrape it out. Never use metal and never apply suction.",
          },
          {
            title: "Restart the phone",
            text: "Sometimes a software glitch freezes the charging circuit. A simple restart can resolve it — especially after a system update.",
          },
          {
            title: "Check for water in the port",
            text: "If your Samsung got wet recently, moisture in the port will prevent charging. Most Samsung phones are IP-rated and will display a 'moisture detected' warning. Leave the port open to air for 30–60 minutes before trying again.",
          },
        ],
      },
      {
        type: "heading",
        text: "Signs the port itself needs repair",
      },
      {
        type: "list",
        items: [
          "Cable feels loose or wobbly in the port",
          "Phone only charges at certain angles",
          "No charging at all despite trying multiple cables and adapters",
          "Port visibly damaged, bent, or has broken internal pins",
          "Phone charges wirelessly (Qi) but not via cable — port is the issue",
        ],
      },
      {
        type: "tip",
        title: "Wireless charging as a temporary workaround",
        text: "If your Samsung supports wireless charging (most Galaxy S and A-series do), you can use this as a workaround while you arrange a port repair. It won't charge as fast, but it'll keep you going.",
        color: "primary",
      },
      {
        type: "warning",
        title: "Don't ignore a damaged port",
        text: "Continuing to force a cable into a damaged port can bend the internal pins further, turning a simple port replacement into a more complex board-level repair. Get it checked sooner rather than later.",
      },
    ],
    relatedSlugs: ["iphone-battery-replacement", "what-to-do-water-damage", "how-long-smartphone-battery-last"],
  },

  "how-long-smartphone-battery-last": {
    slug: "how-long-smartphone-battery-last",
    category: "General",
    title: "How Long Should a Smartphone Battery Last?",
    excerpt: "Most people don't know when a battery is actually failing vs. just aging normally. We explain battery health, capacity degradation, and when to act.",
    image: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?auto=format&fit=crop&w=1400&q=80",
    readTime: "3 min read",
    author: "Jesup Tech Team",
    sections: [
      {
        type: "paragraph",
        text: "All smartphone batteries degrade over time — that's just chemistry. But there's a big difference between normal aging and a battery that's actually failing. Understanding where your battery stands helps you decide when to act and when to wait.",
      },
      {
        type: "heading",
        text: "Battery lifespan: the numbers",
      },
      {
        type: "list",
        items: [
          "Most lithium-ion batteries are rated for 300–500 full charge cycles",
          "For the average user (1–1.5 charges per day), that's roughly 1–2 years before noticeable degradation",
          "Apple targets 80% capacity at 500 cycles — after that, performance declines faster",
          "Samsung rates Galaxy batteries similarly: 500 cycles to 80% capacity",
          "After 2–3 years, most heavy users will feel a real difference",
        ],
      },
      {
        type: "heading",
        text: "What a 'charge cycle' actually means",
      },
      {
        type: "paragraph",
        text: "A charge cycle is 100% of your battery capacity used — but not necessarily in one sitting. If you use 50% one day and recharge, then use 50% the next day and recharge, that's one cycle. This means frequent top-ups from 80% don't use up cycles as fast as people think.",
      },
      {
        type: "heading",
        text: "Habits that kill batteries faster",
      },
      {
        type: "list",
        items: [
          "Charging to 100% and leaving it plugged in overnight repeatedly",
          "Letting the battery drain to 0% regularly",
          "Using the phone while it charges (especially while gaming)",
          "Fast charging every single day — it generates more heat",
          "Leaving the phone in a hot car or direct sunlight",
          "Using cheap third-party chargers without proper power regulation",
        ],
      },
      {
        type: "heading",
        text: "How to make your battery last longer",
      },
      {
        type: "list",
        items: [
          "Keep charge between 20% and 80% for day-to-day use",
          "Use Optimized Charging (iPhone) or Adaptive Charging (Android) — it learns your schedule",
          "Avoid fast charging when you're not in a hurry",
          "Keep the phone at room temperature — heat is the battery's enemy",
          "Enable Low Power Mode or Battery Saver when below 30%",
        ],
      },
      {
        type: "tip",
        title: "Battery replacement is the best value upgrade you can make",
        text: "If your phone is 2–3 years old and battery life has noticeably dropped, a replacement will make it feel like a new device. At Jesup, we carry batteries for all major brands and complete most replacements in under an hour.",
        color: "primary",
      },
    ],
    relatedSlugs: ["iphone-battery-replacement", "laptop-battery-dying-signs", "protect-phone-screen"],
  },
};

export function generateStaticParams() {
  return Object.keys(allGuides).map((slug) => ({ slug }));
}
