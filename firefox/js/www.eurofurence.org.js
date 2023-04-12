/*	
 *	Eurofurence Website Badger for Firefox
 * 	draconigen@gmail.com
 */

const debug = false;

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

	const base = document.getElementsByTagName("base")[0].href;

	var local_data = await storage_get();
	if (debug) console.log(`[ef-badger] local data loaded from storage:`, local_data);

	var server_data = null;

	try
	{
		server_data = await (await fetch(base + "modified.json")).json();

		if (!server_data)
		{
			console.info('[ef-badger] server_data', server_data);
			throw "malformed server_data";
		}

		if (debug) console.log(`[ef-badger] server data loaded from ${base + "modified.json"}:`, server_data);
	}
	catch(ex)
	{
		console.error(`[ef-badger] failed to load "${base + "modified.json"}", reason: ${ex}`);
		return;
	}

	document.querySelectorAll('nav a:not([href^="http"])').forEach(element =>
	{
		const key = element.href.replace(base, '');
		const active = element.classList.contains('ef-active');
		const mod = server_data[key];

		if (!(key in local_data))
		{
			if (debug) console.info(`[ef-badger] "${key}" not in local storage, adding "${key}": ${mod}`);
			element.classList.add('ef-new');
			local_data[key] = mod;
		}
		else if (mod > local_data[key])
		{
			if (debug) console.info(`[ef-badger] ${mod} > ${local_data[key]} -> decorating`);
			element.classList.add('ef-new');
			element.addEventListener('click', async () => 
			{
				if (debug) console.info(`[ef-badger] user clicked on badge, updating "${key}" in local storage`);
				local_data[key] = mod;
				await storage_set(local_data);
				element.classList.remove('ef-new');
			});
		}

		if (active)
		{
			if (debug) console.info(`[ef-badger] updating ${mod} for active page "${key}"`);
			local_data[key] = mod;
		}
	});

	await storage_set(local_data);
});