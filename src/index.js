import puppeteer from "puppeteer";

import { findRegionID } from "./region.js";
import { changeRegion, findPrice, findReview, preparePage, saveData } from "./utils.js";

const productLink = process.argv[2];
const regionId = findRegionID(process.argv[3]);

const browser = await puppeteer.launch({
	headless: false,
	defaultViewport: {
		width: 1280,
		height: 720,
	},
});

if (regionId !== "1")
	await changeRegion(browser, regionId);

const page = await browser.newPage();

await preparePage(page, productLink);

const price = await findPrice(page);
const review = await findReview(page);

await saveData({
	page,
	regionId,
	productLink,
	price,
	review,
});

await browser.close();
