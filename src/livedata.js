var LiveData = (function () {
    'use strict';

    var Ticks = (function() {

        var ticks = {};

        var symbols = function() {
            return Object.keys(ticks);
        };

        var appendData = function (data) {
            var symbol = data.ticks;

            if (!ticks[symbol]) ticks[symbol] = { history: [] };

            ticks[symbol].history.push({
                epoch: data.epoch,
                quote: data.quote
            });
        };

        var history = function (symbol) {
            return ticks[symbol] ? ticks[symbol].history : [];
        };

        var current = function (symbol) {

            if (!ticks[symbol]) return {};

            var lastTick = ticks[symbol].history[ticks[symbol].history.length - 1];

            return {
                symbol: symbol,
                diff: diff(symbol),
                quote: lastTick.quote,
                epoch: lastTick.epoch,
            };
        };

        var diff = function (symbol) {

            var t = ticks[symbol];

            if (!t || !t.history || t.history.length <= 1) return 0;

            return t.history[t.history.length - 1].quote - t.history[t.history.length - 2].quote;
        };

        return {
            symbols: symbols,
            appendData: appendData,
            history: history,
            current: current,
            diff: diff
        };
    })();

    var offerings, ticks, portfolio;

    var offeringsHandler = function(data) {
        offerings = data.offerings.offerings;
    };

    var portfolioHandler = function(data) {

    };

    LiveEvents.on('message', function(data) {
        if (data.offerings) {
            offeringsHandler(data);
        } else if (data.ticks) {
            Ticks.appendData(data);
        } else if (data.portfolio) {
            portfolioHandler(data);
        }
    });

    var init = function() {

        LiveApi.init();

        LiveApi.send({portfolio:1});
        LiveApi.send({offerings:{}});
        LiveApi.send({ ticks: 'R_100' });
        LiveApi.send({ ticks: 'frxXPDUSD' });
    }

    return {
        init: init,
        offerings: offerings,
        Ticks: Ticks,
        portfolio: portfolio
    };
})();
