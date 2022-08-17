const mq = require("mithril-query");
const o = require("ospec");
const { Counter } = require("../components/counter/counter");

o.spec("MyComponent", function () {
    o("things are working", function () {
        const out = mq(Counter, { text: "What a wonderful day to be alive!" });

        out.should.contain("1");
    });
});
