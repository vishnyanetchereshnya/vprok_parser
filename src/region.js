export const REGION_IDS = {
	"Москва и область": "1",
	"Санкт-Петербург и область": "2",
	"Владимирская обл.": "8",
	"Калужская обл.": "12",
	"Рязанская обл.": "26",
	"Тверская обл.": "33",
	"Тульская обл.": "34",
};

const REGION_NAMES = Object.keys(REGION_IDS).reduce((acc, name) => {
	acc[REGION_IDS[name]] = name;

	return acc;
}, {});

export const findRegionID = (input) => {
	const id = REGION_IDS[input];

	if (id) return id;

	for (const [name, id] of Object.entries(REGION_IDS)) {
		if (name.includes(input))
			return id;
	}
};

export const getRegionByID = (id) => REGION_NAMES[id];
