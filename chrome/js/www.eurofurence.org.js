/*	
 *	Eurofurence Website Badger for Firefox
 * 	draconigen@gmail.com
 */

const debug = true;
const now = Math.floor(Date.now() / 1000);

// decorate news on news ready
document.body.addEventListener("newsLoaded", async () =>
{
	// make sure to run only once
	if (window.badgerized)
		return;
	window.badgerized = true;

	var data = await chrome.storage.local.get();
	if (debug) console.log("data loaded from storage:", data);

	document.querySelectorAll("[data-lastmodified]").forEach(element =>
	{
		const page = element.href;
		const mod = element.dataset.lastmodified;
		const active = element.classList.contains('ef-active');

		console.log("> ", page);

		if (!(page in data))
		{
			if (debug) console.info(`adding ${mod} for page ${page}`);
			data[page] = mod;
		}
		
		if (mod > data[page])
		{
			if (debug) console.info(`${mod} > ${data[page]} -> decorating`)
			{
				let badge = document.createElement("span");
				badge.classList.add("ef-badger-new");
				badge.innerHTML = "new";
				element.appendChild(badge);

				element.addEventListener('click', () => 
				{
					if (debug) console.log(`user clicked on badge, updating ${page}`);
					data[page] = mod;
					chrome.storage.local.set(data);
				});
			}
		}

		if (active) // show the badge once if page is accessed directly
		{
			if (debug) console.info(`updating ${mod} for active page ${page}`);
			data[page] = mod;
		}	
	});

	chrome.storage.local.set(data);
});