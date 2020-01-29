function format(results) {
    let html = '<li>Name | Status code</li>';

    for (const result of results) {
        let code = result.code;
        let css = 'blue';
        if (code >= 200 && code <= 299) {
            css = 'green';
        } else if (code >= 300 && code <= 399) {
            css = 'yellow'
        } else if (code >= 400 && code <= 499) {
            css = 'orange';
        } else if (code >= 500 && code <= 599) {
            css = 'red'
        }

        html += `<li>${result.name} | <span style="color:${css}">${result.code}</span></li>`
    }

    return  `<ul>${html}</ul>`;
}

module.exports.requestGroupActions = [
    {
        label: 'Send Requests',
        action: async (context, data) => {
            const { requests } = data;

            // Gather the execution number
            let prom = context.app.prompt('How many times do you want to run this folder ?');

            // With this result we can call our WS
            prom.then(async function(times) {
                let results = [];

                for (let i = 0; i < times; i++) {
                    for (const request of requests) {
                        // Call the request
                        let response = await context.network.sendRequest(request);

                        // Push result into return array
                        results.push({'name' : request.name, 'code' : response.statusCode});
                    }
                }

                // Format content for modal
                let html = format(results);

                // Show modal
                context.app.showGenericModalDialog('Call results', { html });
            });
        },
    },
];