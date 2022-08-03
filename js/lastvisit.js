class LastVisit
{
    // static async get(page)
    // {
    //     return new Promise((resolve, reject) =>
    //     {
    //         browser.storage.local.get(page, (result =>
    //         {
    //             console.log("LastVisit.get result: ", result);
    //             if (result === undefined)
    //                 reject();
    //             else
    //                 resolve(result);
    //         }))
    //     })
    // }

    // static async set(page, time)
    // {
    //     return new Promise((resolve, reject) =>
    //     {
    //         browser.storage.local.set({[page]: time}, (result =>
    //         {
    //             console.log("LastVisit.set result: ", result);
    //             if (result === undefined)
    //                 reject();
    //             else
    //                 resolve(result);
    //         }))
    //     })
    // }

    static get(page)
    {
        console.log("getting", page);
        browser.storage.local.get(page).then(result => 
        {
            console.log("LV.get result", result);
            return result;
        })
    }

    static set(page, time)
    {
        browser.storage.local.set({[page]: time}).then(result => 
        {
            console.log("LV.set result", result);
            return result;
        })
    }
}