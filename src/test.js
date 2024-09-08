import fs from "fs";
import puppeteer from "puppeteer";
import zip from "zip-lib";

import { getRegionByID, REGION_IDS } from "./region.js";
import { changeRegion, findPrice, findReview, preparePage, saveData } from "./utils.js";

const LINKS = [
	"https://www.vprok.ru/product/domik-v-derevne-dom-v-der-moloko-ster-3-2-950g--309202",
	"https://www.vprok.ru/product/domik-v-derevne-dom-v-der-moloko-ster-2-5-950g--310778",
	"https://www.vprok.ru/product/makfa-makfa-izd-mak-spirali-450g--306739",
	"https://www.vprok.ru/product/greenfield-greenf-chay-gold-ceyl-bl-pak-100h2g--307403",
	"https://www.vprok.ru/product/chaykofskiy-chaykofskiy-sahar-pesok-krist-900g--308737",
	"https://www.vprok.ru/product/lavazza-kofe-lavazza-1kg-oro-zerno--450647",
	"https://www.vprok.ru/product/parmalat-parmal-moloko-pit-ulster-3-5-1l--306634",
	"https://www.vprok.ru/product/perekrestok-spmi-svinina-duhovaya-1kg--1131362",
	"https://www.vprok.ru/product/vinograd-kish-mish-1-kg--314623",
	"https://www.vprok.ru/product/eko-kultura-tomaty-cherri-konfetto-250g--946756",
	"https://www.vprok.ru/product/bio-perets-ramiro-1kg--476548",
	"https://www.vprok.ru/product/korkunov-kollektsiya-shokoladnyh-konfet-korkunov-iz-molochnogo-shokolada-s-fundukom-karamelizirovannym-gretskim-orehom-vafley-svetloy-orehovoy--1295690",
	"https://www.vprok.ru/product/picnic-picnic-batonchik-big-76g--311996",
	"https://www.vprok.ru/product/ritter-sport-rit-sport-shokol-tsel-les-oreh-mol-100g--305088",
	"https://www.vprok.ru/product/lays-chipsy-kartofelnye-lays-smetana-luk-140g--1197579",
];

const browser = await puppeteer.launch({
	headless: false,
	defaultViewport: {
		width: 1280,
		height: 720,
	},
});

for (const regionId of Object.values(REGION_IDS)) {
	await changeRegion(browser, regionId);

	const page = await browser.newPage();

	page.setDefaultTimeout(120000);

	for (const productLink of LINKS) {
		await preparePage(page, productLink);

		const price = await findPrice(page);
		const review = await findReview(page);

		await saveData({ page, regionId, productLink, price, review });
	}

	await page.close();

	const regionPath = `./output/${getRegionByID(regionId)}`;

	await zip.archiveFolder(regionPath, `${regionPath}.zip`);

	fs.rmSync(regionPath, { recursive: true, force: true });
}

await browser.close();
