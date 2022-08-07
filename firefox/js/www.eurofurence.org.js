/*	
 *	Eurofurence Website Badger for Firefox
 * 	draconigen@gmail.com
 */

const debug = true;

async function storage_get()
{
	return await browser.storage.local.get(); // browser-specific code
}
async function storage_set(data)
{
	return await browser.storage.local.set(data); // browser-specific code
}
 
document.body.addEventListener("newsLoaded", async () =>
{
	// make sure to run only once
	if (window.badgerized)
		return;
	window.badgerized = true;

	var data = await storage_get();
	if (debug) console.log(`[ef-badger] data loaded from storage:`, data);

	document.querySelectorAll('[data-lastmodified]').forEach(element =>
	{
		const page = element.href;
		const mod = element.dataset.lastmodified;
		const active = element.classList.contains('ef-active');

		if (!(page in data))
		{
			if (debug) console.info(`page not in storage, adding ${page}`);
			element.classList.add('ef-new');
			data[page] = mod;
		}
		else if (mod > data[page])
		{
			if (debug) console.info(`${mod} > ${data[page]} -> decorating`)
			{
				element.classList.add('ef-new');

				element.addEventListener('click', async () => 
				{
					if (debug) console.info(`user clicked on badge, updating ${page}`);
					data[page] = mod;
					await storage_set(data);
					element.classList.remove('ef-new');
				});
			}
		}

		if (active)
		{
			if (debug) console.info(`updating ${mod} for active page ${page}`);
			data[page] = mod;
		}
	});

	await storage_set(data);
});