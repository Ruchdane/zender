var mq = require("mithril-query")
var o = require("ospec")
const { Counter } = require("../components/counter/counter")

o.spec("MyComponent", function() {
    o("things are working", function() {
        var out = mq(Counter, {text: "What a wonderful day to be alive!"})

        out.should.contain("1")
    })
})