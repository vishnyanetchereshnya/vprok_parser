import fs from "fs";

import { getRegionByID } from "./region.js";

export const changeRegion = async (browser, regiodId) => {
	console.log("changeRegion", "newPage");
	const page = await browser.newPage();

	page.getDefaultTimeout(120000);

	console.log("changeRegion", "setCookie");
	await page.setCookie({
		name: "region",
		domain: ".vprok.ru",
		value: regiodId,
	}, {
		name: "regionChange",
		domain: ".vprok.ru",
		value: "1",
	});

	console.log("changeRegion", "goto");
	await page.goto("https://www.vprok.ru/", {
		waitUntil: "domcontentloaded",
	});

	console.log("changeRegion", "waitForSelector");
	try {
		await page.waitForSelector('[class^="FeaturePageHomeBase_container__"]');
	} catch {
		await page.reload({
			waitUntil: "domcontentloaded",
		});
		await page.waitForSelector('[class^="FeaturePageHomeBase_container__"]');
	}

	console.log("changeRegion", "close");
	await page.close();
};

export const preparePage = async (page, productLink) => {
	console.log("preparePage", "goto");
	await page.goto(productLink, {
		waitUntil: "domcontentloaded",
	});

	console.log("preparePage", "waitTooltip");
	// wait for page to be fully load to get correct scroll height
	try {
		await page.waitForSelector('[class^="Tooltip_root__"]');
	} catch {
		await page.reload({
			waitUntil: "domcontentloaded",
		});
		await page.waitForSelector('[class^="Tooltip_root__"]');
	}

	console.log("preparePage", "scrollToFooter");
	// scroll to load footer
	await page.evaluate(() => {
		window.scrollBy(0, 10000);
	});

	console.log("preparePage", "waitFooter");
	// wait for footer to load
	await page.waitForSelector('[class^="UiFooterBottomBase_footerBottom__"]');

	console.log("preparePage", "scrollTop");
	// scroll back to load header
	await page.evaluate(() => {
		window.scrollBy(0, -10000);
	});
	await new Promise((r) => setTimeout(r, 400));

	console.log("preparePage", "deleting");
	// delete useless elements
	console.log("preparePage", "stickyHeader");
	try {
		await page.$eval('[class*="StickyHeader_root__"]', el => el.remove());
	} catch { }
	try {
		console.log("preparePage", "tooltip");
		await page.$eval('[class^="Tooltip_root__"]', el => el.remove());
	} catch { }
	try {
		console.log("preparePage", "cookiesAlert");
		await page.$eval('[class^="CookiesAlert_policy__"]', el => el.remove());
	} catch { }
};

export const findPrice = async (page) => {
	try {
		const priceElem = await page.$('[class^="PriceInfo_root__"]');
		const priceText = await page.evaluate(el => el.textContent, priceElem);

		return priceText.match(/([\d,\s]+)\s?₽/g).map((price) => parseFloat(price.replace(/\s|₽/g, "").replace(",", ".")));
	} catch { }

	// out of stock
	return [0];
};

export const findReview = async (page) => {
	const starsElem = await page.$('[class^="ActionsRow_stars__"]');
	const starsText = await page.evaluate(el => el.textContent, starsElem);

	const reviewElem = await page.$('[class^="ActionsRow_reviews__"]');
	const reviewText = await page.evaluate(el => el.textContent, reviewElem);
	const reviewCount = reviewText.match(/([\d,.\s]+)/)?.[1];

	return [
		parseFloat(starsText) ?? 0,
		reviewCount ? parseInt(reviewCount.replace(" ", "")) : 0,
	];
};

export const takeScreenshot = async (page, filePath = "fullpage.jpg") => {
	await page.screenshot({ path: filePath, fullPage: true, type: "jpeg" });
};

export const saveData = async ({ page, regionId, productLink, price, review }) => {
	const productName = productLink.match(/product\/(.+)-{2}?/)[1];

	const path = `./output/${getRegionByID(regionId)}/${productName}`;

	if (!fs.existsSync(path)) {
		fs.mkdirSync(path, { recursive: true });
	}

	let productData = "";

	if (price[1])
		productData += `price=${price[1]}\noldPrice=${price[0]}`;
	else
		productData += `price=${price[0]}`;

	productData += `\nrating=${review[0]}\nreviewCount=${review[1]}`;

	fs.writeFileSync(`${path}/product.txt`, productData);

	await takeScreenshot(page, `${path}/screenshot.jpg`);
};
