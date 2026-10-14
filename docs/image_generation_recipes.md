# Gere Lo-Fi Pixel Art – Képgenerálási Receptek és Dokumentáció

Ez a dokumentum rögzíti a két sikeres, 3D perspektívájú, 16-bit cozy pixel art jelenet pontos generálási paramétereit, referencia-útvonalait és promptjait, hogy a stílus és a karakter bármikor 100%-ban reprodukálható legyen.

---

## 1. Karakter Referencia és Alapadatok (Gere)
* **Karakter jellemzői:** Barátságos fiatalember, rövid vörösesbarna haj, jellegzetes vöröses szakáll és bajusz, szögletes fekete szemüvegkeret.
* **Fő forrásfotó:** `assets/images/user_photo_portrait.jpg` (és `assets/images/user_photo_vacation.jpg`)
* **Stílusirányzat:** 16-bit retro/cozy lo-fi pixel art (90-es évek anime és lo-fi stream esztétika, lágy fényekkel, valódi 3D/izometrikus perspektívával és árnyékokkal, nem lapos 2D).

---

## 2. Jelenet: Gamer Szoba DayZ játékkal és 2 Monster dobozzal (`scene_gaming_dayz.jpg`)

### Paraméterek
* **Eszköz:** `generate_image`
* **Képarány (AspectRatio):** `16:9`
* **Referenciakép:** `C:\Users\Gere\.gemini\antigravity-ide\brain\ca260453-4832-4d4c-9f67-f8edc77cc1e4\orig_scene_gaming_dayz.jpg` (és a portré fotó)
* **Mentési hely a projektben:** `e:\GIT\lofi-chill-web\assets\images\scene_gaming_dayz.jpg`
* **Mentési másolat:** `C:\Users\Gere\.gemini\antigravity-ide\brain\ca260453-4832-4d4c-9f67-f8edc77cc1e4\scene_gaming_monster.jpg`

### Pontos Prompt
```text
In the exact same 16-bit cozy pixel art style, perspective, lighting, and composition as the reference image: The friendly man with short reddish-brown hair, black glasses, and reddish beard wearing a Hawaiian patterned shirt sitting at his wooden desk playing DayZ on his large computer monitor at night. On the wooden desk to the left of the keyboard where the tea mug was, replace it with 1-2 Monster Energy drink cans (classic black can with neon green claw logo and a white Ultra Monster can) standing on the wooden desk in matching 3D perspective with realistic pixel shadows and warm desk lamp reflections. Keep everything else intact: the DayZ survival game on screen with foggy forest, ambient lighting, cozy lo-fi gamer atmosphere, detailed 16-bit pixel art.
```

### Kulcselemek
1. **DayZ túlélőjáték a monitoron:** Ködös északi fenyőerdő, elhagyatott őrtorony, hátizsákos túlélő hátulról, survival HUD (élet, hidratáció, éhség ikonok, iránytű).
2. **Két Monster doboz:**
   * **Klasszikus fekete Monster:** neon zöld 3-karom logó, fémes fedél és perem 3D henger perspektívában.
   * **Monster Ultra (Fehér):** dombornyomott ezüstszürke karom textúra, világos doboztest, valósághű árnyékvetés az asztallapra.
3. **Hangulat:** Meleg asztali lámpafény a falon és a polcon, növények, háttérben égősor és éjszakai ablak.

---

## 2.B Jelenet Változat: Gamer Szoba The Witcher 3: Wild Hunt játékkal (`scene_gaming_witcher3.jpg`)

### Paraméterek
* **Eszköz:** `generate_image`
* **Képarány (AspectRatio):** `16:9`
* **Referenciakép:** `C:\Users\Gere\.gemini\antigravity-ide\brain\ca260453-4832-4d4c-9f67-f8edc77cc1e4\scene_gaming_monster.jpg`
* **Mentési hely a projektben:** `e:\GIT\lofi-chill-web\assets\images\scene_gaming_witcher3.jpg`
* **Loop GIF:** `e:\GIT\lofi-chill-web\assets\loops\loop_gaming.gif` (DayZ és Witcher 3 között váltakozó CRT loop)

### Pontos Prompt
```text
In the exact same 16-bit cozy pixel art style, perspective, lighting, and composition as the reference image: The friendly man with short reddish-brown hair, black glasses, and reddish beard in a Hawaiian shirt sitting at his wooden desk playing an RPG on his computer monitor at night. On the computer monitor screen, clearly show The Witcher 3: Wild Hunt video game in crisp 16-bit pixel art: Geralt of Rivia with white hair and dual swords on his back standing in a scenic fantasy landscape with golden sunset sky and windblown trees, with the iconic Witcher 3 Wolf Medallion red health bar HUD in the upper left corner and circular minimap in upper right. On the desk to the left, keep the two Monster Energy cans (black Monster and white Ultra Monster) and mechanical keyboard. Everything else in the cozy room remains identical.
```

### Kulcselemek
1. **The Witcher 3: Wild Hunt a monitoron:** Ríviai Geralt fehér hajjal és a hátán keresztbe vetett acél és ezüst kardokkal a veleni aranyló naplementét nézi.
2. **Witcher 3 HUD:** Bal felső sarokban a vörös életerőcsík a jellegzetes farkasfej medállal, jobb felső sarokban a kerek minimap.
3. **Loop Animáció:** A `loop_gaming.gif` 2-3 másodpercenként retro CRT glitch és képcső-átkapcsolási villanással váltogat a DayZ és a The Witcher 3 között!

---

## 3. Jelenet: Éjszakai Kódolás Hacker Eszközökkel és Monsterrel (`scene_coding.jpg`)

### Paraméterek
* **Eszköz:** `generate_image`
* **Képarány (AspectRatio):** `16:9`
* **Referenciakép:** `C:\Users\Gere\.gemini\antigravity-ide\brain\ca260453-4832-4d4c-9f67-f8edc77cc1e4\orig_scene_coding.jpg`
* **Mentési hely a projektben:** `e:\GIT\lofi-chill-web\assets\images\scene_coding.jpg`
* **Mentési másolat:** `C:\Users\Gere\.gemini\antigravity-ide\brain\ca260453-4832-4d4c-9f67-f8edc77cc1e4\scene_coding_monster_hacker.jpg`

### Pontos Prompt
```text
In the exact same 16-bit cozy pixel art style, 3D perspective, lighting, and composition as the reference image: The friendly man with short reddish hair, black glasses, and reddish beard in a black hoodie typing on a mechanical keyboard in front of dual monitors showing code and terminal at night with rain outside the window. On the wooden desk to the left of the keyboard, replace the coffee mug with a Monster Energy drink can (black can with neon green claw logo) in matching 3D perspective with realistic pixel shadows and warm lamp reflections. On the desk next to the can, place hacker tools: a small white Flipper Zero device with a tiny orange LCD screen and antenna, and an SDR transceiver tool with dual antennas and tiny glowing green/blue LEDs. Render all items seamlessly in the exact same 16-bit pixel art style with proper perspective and lighting.
```

### Kulcselemek
1. **Dupla monitor:** Bal oldalon sötét témájú kódszerkesztő színes szintaxis-kiemeléssel, jobb oldalon terminálablak villogó parancssorral.
2. **Fekete Monster Energy doboz:** Kinyitott doboztető (nyitófül), 3D hengeres megvilágítás az asztali lámpa felől, árnyék a fa asztallapon.
3. **Hacker eszközök:**
   * **Flipper Zero:** Narancssárga-fehér jellegzetes borítás, szögben elhelyezve a billentyűzet előtt az asztalon.
   * **SDR Transzciviler / WiFi Pineapple jellegű rádiós eszköz:** Két függőleges antenna, világító zöld és ciánkék adatcsomag-LED-ek, csatlakoztatott USB kábelvezetés.
4. **Környezet:** Esőcseppek az ablaküvegen a háttérben, hold és éjszakai városkép, mechanikus billentyűzeten gépelő kezek, kényelmes fekete kapucnis pulóver.

---

## 4. Jelenet: Napsütötte Erdei Séta a Folyóparton (`scene_forest_walk.jpg`)

### Paraméterek
* **Eszköz:** `generate_image`
* **Képarány (AspectRatio):** `16:9`
* **Forráskép a projektben:** `e:\GIT\lofi-chill-web\assets\images\scene_forest_walk.jpg`
* **Loop GIF:** `e:\GIT\lofi-chill-web\assets\loops\loop_forest_walk.gif`

### Pontos Prompt
```text
16-bit cozy pixel art of the man from reference image (wearing black glasses, reddish beard, comfortable hoodie) taking a peaceful walk on a dirt trail in a riverside forest. A clean river flowing alongside the trail with soft water ripples, lush pine trees, autumn leaves on the ground, golden twilight sky filtering through the forest canopy, calm nature lo-fi chill mood.
```

### Animált elemek a loopban
1. **Folyóvíz hullámzás:** A kanyargó kék folyóvízen finoman végigfutó fény- és vízfodrozódás pixel animáció.
2. **Hulló őszi levelek:** Puhán lefelé szálló aranysárga és narancs pixel falevelek az őszi szellőben.
3. **Fények:** A fák lombkoronáján átszűrődő meleg aranyló napfénycsóvák.

---

## 5. Jelenet: Meghitt Panelkonyha Főzés (`scene_panel_kitchen.jpg`)

### Paraméterek
* **Eszköz:** `generate_image`
* **Képarány (AspectRatio):** `16:9`
* **Forráskép a projektben:** `e:\GIT\lofi-chill-web\assets\images\scene_panel_kitchen.jpg`
* **Loop GIF:** `e:\GIT\lofi-chill-web\assets\loops\loop_panel_kitchen.gif`

### Pontos Prompt
```text
16-bit cozy pixel art of the man from reference image (wearing black glasses, reddish beard, home clothes) cooking in a small cozy Hungarian panel flat apartment kitchen (panelkonyha). Typical compact retro panel cabinets, white tiled backsplash, 4-burner gas stove with blue flame, small window showing typical concrete panel block apartment buildings (panelház) outside in the evening twilight, steaming metal pot on the stove, warm comforting amber light, peaceful lo-fi chill mood.
```

### Animált elemek a loopban
1. **Gázláng vibrálás:** A fazék alatti kék gázrózsa finom, meleg pulzálása.
2. **Finom ételgőz:** A forró fazékból természetesen felfelé kígyózó, elenyésző lágy pixel-gőzfelhők.
3. **Csillagok az ablakban:** A szürkületi égbolton finoman csillogó pontok az ablaküvegen túl.
4. **Meleg lámpafény:** Az asztali lámpa kellemes, lágy fénye.
