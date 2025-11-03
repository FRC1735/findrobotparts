![Find Robot Parts](/images/logo/find-robot-parts-color-reverse.svg)
# Find Robot Parts
The goal of **[Find Robot Parts](https://findrobotparts.com/)** is to save teams time and effort by centralizing the research process. Instead of searching through multiple manufacturer sites or supplier catalogs, users can browse a single, unified directory built specifically for the needs of the robotics community. It’s a practical tool that supports teams of all sizes in finding reliable components for their robot.

The products have a heavy focus toward the **FIRST Robotics Competition (FRC)**, but it is not limited to that organization. All products listed should not be considered legal for FRC without your own research.

---

## How It Works

Each category of parts (e.g., **Motors**, **Wire Connectors**, **Motor Controllers**) is defined by a single JSON file in the repository. These JSON files describe the **category metadata**, **column headers**, and a list of **products** with their specifications and vendor links.

File locations for motors:
- `/data/motors.json`
- `/images/motors/neo-vortex.jpg`
- `/images/motors/kraken-x60.webp`

All HTML pages are automatically rendered and all images are automatically resized when pushed to GitHub.

---

## JSON Format

Each file defines a **category** and its **products**.

```json
{
	"title": "Structure",
	"description": "<p>These structural materials make it easy to build your chassis or other subsystems of your robot.</p>",
	"filter_groups": ["Type", "Width", "Length", "Thickness", "Pattern", "Material"],
	"products": [
		{
			"name": "1\" x 1\" Aluminum Box",
			"image": "/images/products/structure/am-1x1.webp",
			"filters": {
				"Type": ["Square Tube"],
				"Width": ["1\""],
				"Length": ["12\"", "24\"", "36\"", "72\""],
				"Thickness": ["0.063\""],
				"Pattern": ["Solid"],
				"Material": ["Aluminum"]
			},
			"links": [
				{ "vendor": "AndyMark", "link": "https://andymark.com/products/box-tube-extrusion" }
			]
		}
	]
}
```
### JSON Fields Explained

| Field            | Type               | Description                                           |
| ---------------- | ------------------ | ----------------------------------------------------- |
| `title`          | String             | Shown at the top of the page and in the the title tag |
| `filter_groups`  | Array of Strings   | Column/filter names for product attributes            |
| `products`       | Array of `product` | List of individual products in alphabetical order     |

#### `product` stucture
| Field     | Type                    | Description                                   |
| --------- | ----------------------- | --------------------------------------------- |
| `name`    | String                  | Product name, avoid repeating the category. For example, on the Gears page use **16T** instead of **16T gear**. If different vendors make the same type of product then add the vendor name in front so it would become **AndyMark 16T**. |
| `image`   | String                  | Relative path to image                        |
| `filters` | `filter` Object         | Maps each filter group to one or more values. |
| `links`   | Array of `link` Objects | List of vendor links (vendor + link).         |

#### `filter` object structure
The `filter` object is dynamic and depends on the `filter_groups`. The keys of the object must match the values of the `fiter_groups`.
| Field              | Type             | Description                                                      |
| ------------------ | ---------------- | ---------------------------------------------------------------- |
| `filter_groups[0]` | Array of Strings | List of values that match the first item in the `filter_groups`  |
| `filter_groups[1]` | Array of Strings | List of values that match the second item in the `filter_groups` |
| `filter_groups[2]` | Array of Strings | List of values that match the third item in the `filter_groups`  |
| `filter_groups[3]` | Array of Strings | List of values that match the fourth item in the `filter_groups` |

***link* object structure**
Link to the product page when possible. Search pages are acceptable if it allows you to combine multiple links into one listing. List each vendor who sells the exact same product. If two vendors each make the same product, they are separate listings. If they both sell the same sourced product, they share one listing.
| Field    | Type   | Description                              |
| -------- | ------ | ---------------------------------------- |
| `vendor` | String | Official name of the vendor.             |
| `link`   | String | Link to the page that sells the product. |

### Images
- All product images live in `/images/<category>/`.
- Acceptable formats: `.jpg`, `.png`, `.webp`, or `.avif`
- Use lowercase filenames with dashes. The vendor name should be first when needed. The name should be the same if not similar to the product name. If the product name is **Ruland Hex** then the filename should be **ruland-hex.jpg**.
- Use the extension of the original image. 
- Do not modify `/www/images` folder when removing a product.

## Removing a product
When a product is no longer available it needs to be removed from the system. To do this do the following steps:
1. Remove the product from the JSON file in `/data/`
2. Delete the image from `/images/products/`
3. Delete the image from `/www/images/products/`

## How to Contribute
We welcome community contributions!
If you know of a product that should be added or updated, follow these steps:

1. Fork the Repository
Click Fork in the upper-right corner of this page.

2. Add or Edit a JSON File
Modify files as described above.
Verify all paths and vendor links.

3. Commit and Push
Use clear commit messages such as:
Add: New gusset – The Thrifty Bot 90 Degree
Fix: Added new vendor to WCP SwerveX2

4. Submit a Pull Request
When you open a PR:
The image converter will resize and optimize any new images.
HTML files will be generated from modified JSON
Maintainers will review your submission before merging.

## Maintainers
**Find Robot Parts** is maintained by [FRC1735](https://github.com/FRC1735/) and was originally created by [Nick Galotti](https://github.com/ngalotti) and Mike Strickland.

To report issues or suggest improvements, open a GitHub Issue or create a fork and make a change.