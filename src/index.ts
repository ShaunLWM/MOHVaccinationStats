import fetch from "node-fetch";
import cheerio from "cheerio";
import fs from "fs-extra";

(async () => {
	try {
		const history = fs.readJsonSync("history.json", { throws: false }) ?? {};
		const response = await fetch("https://www.moh.gov.sg/covid-19/vaccination", {
			headers: {
				"user-agent":
					"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.190 Safari/537.36",
			},
		});

		const body = await response.text();
		const $ = cheerio.load(body);
		const arr = ["Received First Dose", "Completed Full Vaccination Regimen", "Total Doses Administered"];
		const p = arr.map((text) =>
			Number($(`strong:contains("${text}")`).parents().eq(2).siblings().text().replace(/,/g, ""))
		);

		history[new Date().toISOString().slice(0, 10)] = p;
		fs.writeFileSync("history.json", JSON.stringify(history, null, 2));
	} catch (error) {
		throw new Error(error);
	}
})();
